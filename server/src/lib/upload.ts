import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
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
 * Resolve the server project root reliably on both local dev and cPanel.
 *
 * On cPanel, Phusion Passenger sets process.cwd() to the domain document root
 * (e.g. /home/selamcen/api.selamcharity.org) which does NOT contain the
 * public/ folder and is not writable by the app.
 *
 * __dirname inside the compiled dist/ folder is:
 *   /home/selamcen/api.selamcharity.org/<app_dir>/dist/lib
 * So going up 3 levels (lib → dist → app_dir) gives us the project root
 * where public/ lives.
 *
 * We also fall back to process.cwd() for local development where __dirname
 * and cwd() are already aligned.
 */
function getProjectRoot(): string {
  // __dirname = .../dist/lib  →  go up to dist/  →  go up to project root
  const fromDirname = path.resolve(__dirname, '..', '..');
  const publicFromDirname = path.join(fromDirname, 'public');

  // Prefer __dirname-derived path when public/ exists there, otherwise fall
  // back to process.cwd() (works fine in local development).
  try {
    const fs = require('fs');
    if (fs.existsSync(publicFromDirname)) {
      return fromDirname;
    }
  } catch (_) {}

  return process.cwd();
}

/**
 * Upload a base64 file string to either Cloudinary or local storage.
 * Controlled by the STORAGE_MODE environment variable.
 */
export async function uploadToLocal(fileString: string | null | undefined, folder: string) {
  if (!fileString) return null;

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

    // Anchor to project root via __dirname so this works on both local dev and cPanel
    const uploadDir = path.join(getProjectRoot(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return `/uploads/${folder}/${fileName}`;
  } catch (err) {
    console.error(`Local upload error for ${folder}:`, err);
    return null;
  }
}

/**
 * Upload a local disk file (saved by multer) to the target storage backend (local public folder or Cloudinary)
 */
export async function uploadFileFromDisk(
  filePath: string | null | undefined,
  folder: string,
  originalName?: string
): Promise<string | null> {
  if (!filePath) return null;

  if (isLocal) {
    try {
      const ext = originalName ? path.extname(originalName) : path.extname(filePath);
      const baseName = path.basename(filePath);
      const fileName = ext && !baseName.endsWith(ext) ? `${baseName}${ext}` : baseName;

      const targetDir = path.join(getProjectRoot(), 'public', 'uploads', folder);
      await mkdir(targetDir, { recursive: true });

      const targetPath = path.join(targetDir, fileName);

      // Move file from temp to target location
      const fs = await import('fs/promises');
      try {
        await fs.rename(filePath, targetPath);
      } catch (renameErr) {
        // If rename fails across volumes, fallback to copy + delete
        await fs.copyFile(filePath, targetPath);
        try { await fs.unlink(filePath); } catch (_) {}
      }

      return `/uploads/${folder}/${fileName}`;
    } catch (err) {
      console.error(`Local file move error for ${folder}:`, err);
      return null;
    }
  } else {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `coolstaff/${folder}`,
        resource_type: 'auto',
      });
      const fs = require('fs');
      try {
        fs.unlinkSync(filePath);
      } catch (_) {}
      return result.secure_url;
    } catch (err) {
      console.error(`Cloudinary disk file upload error for ${folder}:`, err);
      return null;
    }
  }
}
