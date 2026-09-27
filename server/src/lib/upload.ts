import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { decryptPath } from './crypto';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set STORAGE_MODE=local in .env for cPanel (local NVMe storage)
// Set STORAGE_MODE=cloudinary in .env for Vercel (cloud storage)
const isLocal = process.env.STORAGE_MODE === 'local';

/**
 * Resolve the upload root directory.
 *
 * Strategy (in order):
 * 1. UPLOAD_ROOT env var — explicit override pointing directly at the uploads dir
 * 2. APP_ROOT env var — must contain a readable public/uploads subdir
 * 3. process.cwd()/public/uploads — works on cPanel (cwd = /home/selamcen/api.selamcharity.org)
 * 4. __dirname-relative fallback
 */
function getUploadsRoot(): string {
  // Option 1: explicit UPLOAD_ROOT points straight to uploads/
  if (process.env.UPLOAD_ROOT) {
    console.log(`[UPLOAD] Using UPLOAD_ROOT env: ${process.env.UPLOAD_ROOT}`);
    return process.env.UPLOAD_ROOT;
  }

  // Option 2: APP_ROOT — only use it if public/ actually exists there
  if (process.env.APP_ROOT) {
    const candidate = path.join(process.env.APP_ROOT, 'public', 'uploads');
    try {
      // verify we can stat the parent (public/) — don't require uploads/ to exist yet
      fs.statSync(path.join(process.env.APP_ROOT, 'public'));
      console.log(`[UPLOAD] Using APP_ROOT env: ${process.env.APP_ROOT}`);
      return candidate;
    } catch {
      console.warn(`[UPLOAD] APP_ROOT=${process.env.APP_ROOT} has no public/ subdir, ignoring`);
    }
  }

  // Option 3: process.cwd() — on cPanel Passenger this is the app dir
  const cwdCandidate = path.join(process.cwd(), 'public', 'uploads');
  try {
    fs.statSync(path.join(process.cwd(), 'public'));
    console.log(`[UPLOAD] Using cwd: ${process.cwd()}`);
    return cwdCandidate;
  } catch {
    // public/ doesn't exist yet under cwd — still use it (mkdir will create it)
  }

  // Option 4: __dirname-relative (dist/lib → up 2 = project root)
  const dirnameCandidate = path.join(path.resolve(__dirname, '..', '..'), 'public', 'uploads');
  console.log(`[UPLOAD] Falling back to __dirname-relative: ${dirnameCandidate}`);
  return dirnameCandidate;
}

/**
 * Upload a base64 file string to either Cloudinary or local storage.
 * Controlled by the STORAGE_MODE environment variable.
 */
export async function uploadToLocal(fileString: string | null | undefined, folder: string) {
  console.log(`[UPLOAD] uploadToLocal called, folder=${folder}, isLocal=${isLocal}, STORAGE_MODE=${process.env.STORAGE_MODE}`);
  if (!fileString) {
    console.warn('[UPLOAD] uploadToLocal: fileString is null/empty');
    return null;
  }

  let cleanString = fileString;
  if (cleanString.includes('/api/assets/')) {
    cleanString = cleanString.split('/api/assets/')[1] || cleanString;
  }
  
  if (cleanString.startsWith('ENC-')) {
    try {
      cleanString = decryptPath(cleanString);
    } catch (e) {
      console.error('Failed to decrypt path in uploadToLocal:', e);
    }
  }

  // If it's already a URL or a server-relative path, just return it
  if (
    cleanString.startsWith('http') || 
    cleanString.startsWith('/uploads') || 
    cleanString.startsWith('uploads/')
  ) {
    return cleanString.startsWith('uploads/') ? `/${cleanString}` : cleanString;
  }

  // If it's not a base64 data url and doesn't look like base64, don't try to write it
  if (!fileString.startsWith('data:') && fileString.length < 500 && !fileString.includes(';base64,')) {
    return fileString;
  }

  // Route to the correct storage backend
  if (isLocal) {
    return uploadToLocalDisk(fileString, folder);
  } else {
    return uploadToCloudinary(fileString, folder);
  }
}

/**
 * Upload to Cloudinary (used on Vercel)
 */
async function uploadToCloudinary(fileString: string, folder: string): Promise<string | null> {
  try {
    let dataUri = fileString;
    if (!fileString.startsWith('data:')) {
      dataUri = `data:image/jpeg;base64,${fileString}`;
    }

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `coolstaff/${folder}`,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (err) {
    console.error(`Cloudinary upload error for ${folder}:`, err);
    return null;
  }
}

/**
 * Upload to local disk (used on cPanel)
 */
async function uploadToLocalDisk(fileString: string, folder: string): Promise<string | null> {
  const uploadsRoot = getUploadsRoot();
  const uploadDir = path.join(uploadsRoot, folder);
  console.log(`[UPLOAD] uploadToLocalDisk: uploadsRoot=${uploadsRoot}, uploadDir=${uploadDir}`);

  try {
    let base64Data = fileString;
    let extension = 'bin';

    if (fileString.startsWith('data:')) {
      const matches = fileString.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        base64Data = matches[2];
        extension = mimeType.split('/')[1] || 'bin';
        if (extension === 'jpeg') extension = 'jpg';
      } else {
        base64Data = fileString.split(',')[1] || fileString;
      }
    } else {
      extension = 'jpg';
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `${crypto.randomBytes(16).toString('hex')}.${extension}`;

    console.log(`[UPLOAD] Creating dir: ${uploadDir}`);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    console.log(`[UPLOAD] Writing file: ${filePath} (${buffer.length} bytes)`);
    await writeFile(filePath, buffer);

    const result = `/uploads/${folder}/${fileName}`;
    console.log(`[UPLOAD] Success: ${result}`);
    return result;
  } catch (err: any) {
    console.error(`[UPLOAD] uploadToLocalDisk FAILED for folder=${folder}, uploadDir=${uploadDir}: ${err.message}`, err);
    return null;
  }
}

/**
 * Upload a local disk file (saved by multer) to the target storage backend
 */
export async function uploadFileFromDisk(
  filePath: string | null | undefined,
  folder: string,
  originalName?: string
): Promise<string | null> {
  console.log(`[UPLOAD] uploadFileFromDisk: filePath=${filePath}, folder=${folder}, isLocal=${isLocal}`);
  if (!filePath) {
    console.warn('[UPLOAD] uploadFileFromDisk: filePath is null/empty');
    return null;
  }

  if (isLocal) {
    const uploadsRoot = getUploadsRoot();
    const targetDir = path.join(uploadsRoot, folder);
    console.log(`[UPLOAD] uploadFileFromDisk: uploadsRoot=${uploadsRoot}, targetDir=${targetDir}`);

    try {
      const ext = originalName ? path.extname(originalName) : path.extname(filePath);
      const baseName = path.basename(filePath);
      const fileName = ext && !baseName.endsWith(ext) ? `${baseName}${ext}` : baseName;

      console.log(`[UPLOAD] Creating dir: ${targetDir}`);
      await mkdir(targetDir, { recursive: true });

      const targetPath = path.join(targetDir, fileName);
      console.log(`[UPLOAD] Moving ${filePath} → ${targetPath}`);

      const fsModule = await import('fs/promises');
      try {
        await fsModule.rename(filePath, targetPath);
      } catch (renameErr: any) {
        console.warn(`[UPLOAD] rename failed (${renameErr.message}), trying copy+delete`);
        await fsModule.copyFile(filePath, targetPath);
        try { await fsModule.unlink(filePath); } catch (_) {}
      }

      const result = `/uploads/${folder}/${fileName}`;
      console.log(`[UPLOAD] uploadFileFromDisk success: ${result}`);
      return result;
    } catch (err: any) {
      console.error(`[UPLOAD] uploadFileFromDisk FAILED for folder=${folder}, targetDir=${targetDir}: ${err.message}`, err);
      return null;
    }
  } else {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `coolstaff/${folder}`,
        resource_type: 'auto',
      });
      const fsSync = require('fs');
      try { fsSync.unlinkSync(filePath); } catch (_) {}
      return result.secure_url;
    } catch (err) {
      console.error(`Cloudinary disk file upload error for ${folder}:`, err);
      return null;
    }
  }
}
