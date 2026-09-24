import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { charityMedia } from '../../db/schema';
import { eq, desc, like, or, and } from 'drizzle-orm';
import { authenticateSession, requireRole } from '../../middlewares/auth';
import { getSession } from '../../lib/auth-helper';
import { uploadToLocal, uploadFileFromDisk } from '../../lib/upload';
import { createId } from '@paralleldrive/cuid2';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Fallback JSON store path
const mediaFallbackPath = path.join(process.cwd(), 'public', 'uploads', 'charity', 'media_store.json');

function readFallbackMedia(): any[] {
  try {
    if (fs.existsSync(mediaFallbackPath)) {
      const raw = fs.readFileSync(mediaFallbackPath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[CHARITY MEDIA] Failed to read fallback store:', err);
  }
  return [];
}

function writeFallbackMedia(data: any[]) {
  try {
    const dir = path.dirname(mediaFallbackPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(mediaFallbackPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[CHARITY MEDIA] Failed to save fallback store:', err);
  }
}

// Configure local multer temp destination
const tempUploadDir = path.join(process.cwd(), 'public', 'uploads', 'temp');
if (!fs.existsSync(tempUploadDir)) {
  try {
    fs.mkdirSync(tempUploadDir, { recursive: true });
  } catch (_) {}
}

const upload = multer({
  dest: tempUploadDir,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max limit
});

function detectFileType(mimeOrName: string): 'image' | 'video' | 'document' {
  const lower = mimeOrName.toLowerCase();
  if (
    lower.includes('image') ||
    /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(lower)
  ) {
    return 'image';
  }
  if (
    lower.includes('video') ||
    /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(lower)
  ) {
    return 'video';
  }
  return 'document';
}

// ==========================================
// 1. LIST MEDIA (Search, Filter by Type)
// ==========================================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { fileType, search, limit, offset } = req.query;

    let items: any[] = [];
    try {
      const conditions = [];
      if (fileType && typeof fileType === 'string' && fileType !== 'all') {
        conditions.push(eq(charityMedia.fileType, fileType));
      }
      if (search && typeof search === 'string' && search.trim()) {
        const term = `%${search.trim()}%`;
        conditions.push(
          or(
            like(charityMedia.name, term),
            like(charityMedia.originalName, term),
            like(charityMedia.caption, term)
          )
        );
      }
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const query = db
        .select()
        .from(charityMedia)
        .where(whereClause)
        .orderBy(desc(charityMedia.createdAt));

      if (limit && !isNaN(Number(limit))) query.limit(Number(limit));
      if (offset && !isNaN(Number(offset))) query.offset(Number(offset));

      items = await query;
    } catch (_) {
      items = readFallbackMedia();
    }

    if (!items || items.length === 0) {
      items = readFallbackMedia();
    }

    if (fileType && typeof fileType === 'string' && fileType !== 'all') {
      items = items.filter(m => m.fileType === fileType);
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(m =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.originalName && m.originalName.toLowerCase().includes(q)) ||
        (m.caption && m.caption.toLowerCase().includes(q))
      );
    }

    res.json(items);
  } catch (err: any) {
    console.warn('[CHARITY MEDIA] List fallback:', err.message);
    res.json(readFallbackMedia());
  }
});

// ==========================================
// 2. UPLOAD VIA BASE64 DATA STRING
// ==========================================
router.post('/upload-base64', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const { fileString, fileName, caption, fileType: customType } = req.body;

    if (!fileString || !fileName) {
      return res.status(400).json({ error: 'fileString and fileName are required' });
    }

    const detectedType = customType || detectFileType(fileName);
    const targetFolder = detectedType === 'image' ? 'charity/images' : detectedType === 'video' ? 'charity/videos' : 'charity/documents';

    const uploadedUrl = await uploadToLocal(fileString, targetFolder);
    if (!uploadedUrl) {
      return res.status(500).json({ error: 'Failed to store file' });
    }

    const sizeBytes = Math.round((fileString.length * 3) / 4);
    const newMedia: any = {
      id: createId(),
      name: fileName,
      originalName: fileName,
      url: uploadedUrl,
      fileType: detectedType,
      mimeType: fileString.match(/data:([a-zA-Z0-9\/+-]+);base64/)?.[1] || null,
      sizeBytes,
      caption: caption || null,
      uploadedById: session?.user?.id || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const list = readFallbackMedia();
    list.unshift(newMedia);
    writeFallbackMedia(list);

    try {
      await db.insert(charityMedia).values({
        id: newMedia.id,
        name: newMedia.name,
        originalName: newMedia.originalName,
        url: newMedia.url,
        fileType: newMedia.fileType,
        mimeType: newMedia.mimeType,
        sizeBytes: newMedia.sizeBytes,
        caption: newMedia.caption,
        uploadedById: newMedia.uploadedById,
      });
    } catch (_) {}

    res.status(201).json(newMedia);
  } catch (err: any) {
    console.error('[CHARITY MEDIA] Upload base64 error:', err);
    res.status(500).json({ error: 'Failed to upload media', details: err.message });
  }
});

// ==========================================
// 3. UPLOAD VIA MULTIPART/FORM-DATA (Multer)
// ==========================================
router.post('/upload-file', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), upload.single('file'), async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const detectedType = detectFileType(file.mimetype || file.originalname);
    const targetFolder = detectedType === 'image' ? 'charity/images' : detectedType === 'video' ? 'charity/videos' : 'charity/documents';
    const uploadedUrl = await uploadFileFromDisk(file.path, targetFolder, file.originalname);
    if (!uploadedUrl) {
      return res.status(500).json({ error: 'Failed to store file' });
    }

    const displayName = (req.body.name && req.body.name.trim()) || file.originalname;
    const caption = (req.body.caption && req.body.caption.trim()) || null;

    const newMedia: any = {
      id: createId(),
      name: displayName,
      originalName: file.originalname,
      url: uploadedUrl,
      fileType: detectedType,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      caption,
      uploadedById: session?.user?.id || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const list = readFallbackMedia();
    list.unshift(newMedia);
    writeFallbackMedia(list);

    try {
      await db.insert(charityMedia).values({
        id: newMedia.id,
        name: newMedia.name,
        originalName: newMedia.originalName,
        url: newMedia.url,
        fileType: newMedia.fileType,
        mimeType: newMedia.mimeType,
        sizeBytes: newMedia.sizeBytes,
        caption: newMedia.caption,
        uploadedById: newMedia.uploadedById,
      });
    } catch (_) {}

    res.status(201).json(newMedia);
  } catch (err: any) {
    console.error('[CHARITY MEDIA] Upload file error:', err);
    res.status(500).json({ error: 'Failed to process file upload', details: err.message });
  }
});

// ==========================================
// 4. UPDATE MEDIA METADATA
// ==========================================
router.patch('/:id', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, caption } = req.body;

    const list = readFallbackMedia();
    const idx = list.findIndex(m => m.id === id);
    let updated: any = idx >= 0 ? { ...list[idx] } : { id };

    if (name !== undefined) updated.name = name.trim();
    if (caption !== undefined) updated.caption = caption ? caption.trim() : null;
    updated.updatedAt = new Date().toISOString();

    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    writeFallbackMedia(list);

    try {
      await db.update(charityMedia).set(updated).where(eq(charityMedia.id, id));
    } catch (_) {}

    res.json(updated);
  } catch (err: any) {
    console.error('[CHARITY MEDIA] Update error:', err);
    res.status(500).json({ error: 'Failed to update media', details: err.message });
  }
});

// ==========================================
// 5. DELETE MEDIA
// ==========================================
router.delete('/:id', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const list = readFallbackMedia();
    const existing = list.find(m => m.id === id);
    const filtered = list.filter(m => m.id !== id);
    writeFallbackMedia(filtered);

    if (existing?.url && existing.url.startsWith('/uploads/')) {
      const localFilePath = path.join(process.cwd(), 'public', existing.url.substring(1));
      try {
        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }
      } catch (fileErr) {
        console.warn('[CHARITY MEDIA] Failed to delete file on disk:', fileErr);
      }
    }

    try {
      await db.delete(charityMedia).where(eq(charityMedia.id, id));
    } catch (_) {}

    res.json({ success: true, message: 'Media file deleted successfully' });
  } catch (err: any) {
    console.error('[CHARITY MEDIA] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete media', details: err.message });
  }
});

export default router;
