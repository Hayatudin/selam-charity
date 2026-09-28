import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import { decryptPath } from './crypto';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Dynamically check if local storage mode is active.
 * Evaluated on each call to prevent frozen module-level variables before .env loads.
 */
export function isLocalStorage(): boolean {
  const mode = (process.env.STORAGE_MODE || '').trim().toLowerCase();
  if (mode === 'local') return true;
  if (mode === 'cloudinary') return false;
  
  // If STORAGE_MODE is not explicitly set, prefer local if Cloudinary credentials are missing
  const hasCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY);
  return !hasCloudinary;
}

/**
 * Returns all potential uploads directory candidates across environments.
 */
export function getAllUploadsDirs(): string[] {
  const dirs = new Set<string>();

  // 1. Explicit UPLOAD_ROOT env var
  if (process.env.UPLOAD_ROOT && process.env.UPLOAD_ROOT.trim()) {
    dirs.add(path.resolve(process.env.UPLOAD_ROOT.trim()));
  }

  // 2. Candidate inside process.cwd() (on cPanel: /home/selamcen/api.selamcharity.org/public/uploads)
  dirs.add(path.resolve(process.cwd(), 'public', 'uploads'));

  // 3. Candidate relative to __dirname (dist/lib -> project root /public/uploads)
  dirs.add(path.resolve(__dirname, '..', '..', 'public', 'uploads'));
  dirs.add(path.resolve(__dirname, '..', 'public', 'uploads'));

  // 4. Candidate from APP_ROOT env var if specified (e.g. /home/selamcen or /home/selamcen/api.selamcharity.org)
  if (process.env.APP_ROOT && process.env.APP_ROOT.trim()) {
    const appRoot = process.env.APP_ROOT.trim();
    dirs.add(path.resolve(appRoot, 'public', 'uploads'));
    dirs.add(path.resolve(appRoot, 'api.selamcharity.org', 'public', 'uploads'));
  }

  return Array.from(dirs);
}

/**
 * Resolve the primary writable uploads directory.
 * Tests each candidate for writability and returns the first healthy one.
 */
export function getUploadsRoot(): string {
  // If explicit UPLOAD_ROOT is set and writable, use it
  if (process.env.UPLOAD_ROOT && process.env.UPLOAD_ROOT.trim()) {
    const custom = path.resolve(process.env.UPLOAD_ROOT.trim());
    try {
      if (!fs.existsSync(custom)) fs.mkdirSync(custom, { recursive: true });
      const probe = path.join(custom, `.probe_${Date.now()}`);
      fs.writeFileSync(probe, '1');
      fs.unlinkSync(probe);
      return custom;
    } catch (e: any) {
      console.warn(`[UPLOAD] UPLOAD_ROOT=${custom} is not writable (${e.message}), trying candidates...`);
    }
  }

  const candidates = getAllUploadsDirs();

  for (const dir of candidates) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const probe = path.join(dir, `.probe_${Date.now()}`);
      fs.writeFileSync(probe, 'ok');
      fs.unlinkSync(probe);
      return dir;
    } catch (err: any) {
      console.warn(`[UPLOAD] Candidate directory ${dir} is not writable: ${err.message}`);
    }
  }

  // Guaranteed fallback: OS temp directory
  const fallback = path.join(os.tmpdir(), 'selamcharity-uploads');
  try {
    if (!fs.existsSync(fallback)) fs.mkdirSync(fallback, { recursive: true });
    return fallback;
  } catch (e) {
    return os.tmpdir();
  }
}

/**
 * Upload a base64 file string to either Cloudinary or local storage.
 */
export async function uploadToLocal(fileString: string | null | undefined, folder: string): Promise<string> {
  const localMode = isLocalStorage();
  console.log(`[UPLOAD] uploadToLocal called: folder=${folder}, localMode=${localMode}, STORAGE_MODE=${process.env.STORAGE_MODE}`);
  
  if (!fileString) {
    throw new Error('uploadToLocal: fileString is required');
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
    cleanString.startsWith('http://') || 
    cleanString.startsWith('https://') || 
    cleanString.startsWith('/uploads/') || 
    cleanString.startsWith('uploads/')
  ) {
    return cleanString.startsWith('uploads/') ? `/${cleanString}` : cleanString;
  }

  // If it's not a base64 data url and doesn't look like base64, return it as-is
  if (!fileString.startsWith('data:') && fileString.length < 500 && !fileString.includes(';base64,')) {
    return fileString;
  }

  // Route to the correct storage backend
  if (localMode) {
    return uploadToLocalDisk(fileString, folder);
  } else {
    return uploadToCloudinary(fileString, folder);
  }
}

/**
 * Upload to Cloudinary (used when STORAGE_MODE=cloudinary)
 */
async function uploadToCloudinary(fileString: string, folder: string): Promise<string> {
  try {
    let dataUri = fileString;
    if (!fileString.startsWith('data:')) {
      dataUri = `data:image/jpeg;base64,${fileString}`;
    }

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `selam/${folder}`,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (err: any) {
    console.error(`[UPLOAD] Cloudinary upload error for ${folder}:`, err);
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
}

/**
 * Upload to local disk (used on cPanel and local development)
 */
async function uploadToLocalDisk(fileString: string, folder: string): Promise<string> {
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
    const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${extension}`;

    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    console.log(`[UPLOAD] Writing file: ${filePath} (${buffer.length} bytes)`);
    await writeFile(filePath, buffer);

    const result = `/uploads/${folder}/${fileName}`;
    console.log(`[UPLOAD] Local write success: ${result}`);
    return result;
  } catch (err: any) {
    const errorDetails = `uploadToLocalDisk failed for folder=${folder}, uploadDir=${uploadDir}: ${err.message} (code: ${err.code || 'UNKNOWN'})`;
    console.error(`[UPLOAD] ${errorDetails}`, err);
    const thrownErr = new Error(errorDetails);
    (thrownErr as any).code = err.code;
    (thrownErr as any).uploadDir = uploadDir;
    throw thrownErr;
  }
}

/**
 * Upload a local disk file (saved by multer) to the target storage backend
 */
export async function uploadFileFromDisk(
  filePath: string | null | undefined,
  folder: string,
  originalName?: string
): Promise<string> {
  const localMode = isLocalStorage();
  console.log(`[UPLOAD] uploadFileFromDisk: filePath=${filePath}, folder=${folder}, localMode=${localMode}`);
  
  if (!filePath) {
    throw new Error('uploadFileFromDisk: filePath is required');
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`uploadFileFromDisk: temp file does not exist at ${filePath}`);
  }

  if (localMode) {
    const uploadsRoot = getUploadsRoot();
    const targetDir = path.join(uploadsRoot, folder);
    console.log(`[UPLOAD] uploadFileFromDisk: uploadsRoot=${uploadsRoot}, targetDir=${targetDir}`);

    try {
      const ext = originalName ? path.extname(originalName) : path.extname(filePath);
      const safeExt = ext || '.bin';
      const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;

      if (!fs.existsSync(targetDir)) {
        await mkdir(targetDir, { recursive: true });
      }

      const targetPath = path.join(targetDir, fileName);
      console.log(`[UPLOAD] Moving ${filePath} → ${targetPath}`);

      let moved = false;
      const fsModule = await import('fs/promises');

      // Attempt 1: Fast filesystem rename
      try {
        await fsModule.rename(filePath, targetPath);
        moved = true;
      } catch (renameErr: any) {
        console.warn(`[UPLOAD] rename failed (${renameErr.message}), trying copyFile`);
      }

      // Attempt 2: copyFile then unlink
      if (!moved) {
        try {
          await fsModule.copyFile(filePath, targetPath);
          try { await fsModule.unlink(filePath); } catch (_) {}
          moved = true;
        } catch (copyErr: any) {
          console.warn(`[UPLOAD] copyFile failed (${copyErr.message}), trying sync read/write fallback`);
        }
      }

      // Attempt 3: sync stream buffer read/write fallback
      if (!moved) {
        const fileBuffer = fs.readFileSync(filePath);
        fs.writeFileSync(targetPath, fileBuffer);
        try { fs.unlinkSync(filePath); } catch (_) {}
        moved = true;
      }

      // Verify destination file exists and is readable
      if (!fs.existsSync(targetPath)) {
        throw new Error(`Destination file was not found at ${targetPath} after moving`);
      }

      const result = `/uploads/${folder}/${fileName}`;
      console.log(`[UPLOAD] uploadFileFromDisk success: ${result}`);
      return result;
    } catch (err: any) {
      const errorMsg = `uploadFileFromDisk failed for folder=${folder}, targetDir=${targetDir}: ${err.message} (code: ${err.code || 'UNKNOWN'})`;
      console.error(`[UPLOAD] ${errorMsg}`, err);
      const thrownErr = new Error(errorMsg);
      (thrownErr as any).code = err.code;
      (thrownErr as any).targetDir = targetDir;
      throw thrownErr;
    }
  } else {
    // Cloudinary upload
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `selam/${folder}`,
        resource_type: 'auto',
      });
      try { fs.unlinkSync(filePath); } catch (_) {}
      return result.secure_url;
    } catch (err: any) {
      console.error(`[UPLOAD] Cloudinary disk file upload error for ${folder}:`, err);
      try { fs.unlinkSync(filePath); } catch (_) {}
      throw new Error(`Cloudinary upload failed: ${err.message}`);
    }
  }
}
