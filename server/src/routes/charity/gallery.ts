import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { charityGallery } from '../../db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { authenticateSession, requireRole } from '../../middlewares/auth';
import { createId } from '@paralleldrive/cuid2';
import path from 'path';
import fs from 'fs';

const router = Router();

// Fallback JSON store path
const galleryFallbackPath = path.join(process.cwd(), 'public', 'uploads', 'charity', 'gallery_store.json');

function readFallbackGallery(): any[] {
  try {
    if (fs.existsSync(galleryFallbackPath)) {
      const raw = fs.readFileSync(galleryFallbackPath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[CHARITY GALLERY] Failed to read fallback store:', err);
  }
  return [];
}

function writeFallbackGallery(data: any[]) {
  try {
    const dir = path.dirname(galleryFallbackPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(galleryFallbackPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[CHARITY GALLERY] Failed to save fallback store:', err);
  }
}

// ==========================================
// 1. LIST GALLERY MEDIA (Public)
// ==========================================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, mediaType } = req.query;

    let items: any[] = [];
    try {
      let query = db.select().from(charityGallery);
      if (category && typeof category === 'string' && category !== 'all') {
        query = query.where(eq(charityGallery.category, category)) as any;
      }
      if (mediaType && typeof mediaType === 'string' && mediaType !== 'all') {
        query = query.where(eq(charityGallery.mediaType, mediaType)) as any;
      }
      items = await query.orderBy(asc(charityGallery.orderIndex), desc(charityGallery.createdAt));
    } catch (_) {
      items = readFallbackGallery();
    }

    if (!items || items.length === 0) {
      items = readFallbackGallery();
    }

    if (category && typeof category === 'string' && category !== 'all') {
      items = items.filter(i => i.category === category);
    }
    if (mediaType && typeof mediaType === 'string' && mediaType !== 'all') {
      items = items.filter(i => i.mediaType === mediaType);
    }

    res.json(items);
  } catch (err: any) {
    console.warn('[CHARITY GALLERY] List fallback:', err.message);
    res.json(readFallbackGallery());
  }
});

// ==========================================
// 2. CREATE GALLERY ITEM (Protected)
// ==========================================
router.post('/', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { title, caption, mediaType, mediaUrl, thumbnailUrl, category, orderIndex } = req.body;

    if (!title || !mediaUrl) {
      return res.status(400).json({ error: 'Title and media URL are required' });
    }

    const newItem: any = {
      id: createId(),
      title: title.trim(),
      caption: caption ? caption.trim() : null,
      mediaType: mediaType === 'video' ? 'video' : 'image',
      mediaUrl,
      thumbnailUrl: thumbnailUrl || null,
      category: category || 'General',
      orderIndex: !isNaN(Number(orderIndex)) ? Number(orderIndex) : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to fallback store
    const list = readFallbackGallery();
    list.unshift(newItem);
    writeFallbackGallery(list);

    // Attempt DB insert
    try {
      await db.insert(charityGallery).values({
        id: newItem.id,
        title: newItem.title,
        caption: newItem.caption,
        mediaType: newItem.mediaType,
        mediaUrl: newItem.mediaUrl,
        thumbnailUrl: newItem.thumbnailUrl,
        category: newItem.category,
        orderIndex: newItem.orderIndex,
      });
    } catch (dbErr: any) {
      console.warn('[CHARITY GALLERY] DB insert warning, saved to fallback store:', dbErr.message);
    }

    res.status(201).json(newItem);
  } catch (err: any) {
    console.error('[CHARITY GALLERY] Create error:', err);
    res.status(500).json({ error: 'Failed to create gallery item', details: err.message });
  }
});

// ==========================================
// 2B. BATCH CREATE GALLERY ITEMS (Protected)
// ==========================================
router.post('/batch', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const createdItems: any[] = [];
    const list = readFallbackGallery();

    for (const item of items) {
      if (!item.mediaUrl) continue;
      const newItem: any = {
        id: createId(),
        title: (item.title && item.title.trim()) || 'Gallery Photo',
        caption: item.caption || null,
        mediaType: item.mediaType === 'video' ? 'video' : 'image',
        mediaUrl: item.mediaUrl,
        thumbnailUrl: item.thumbnailUrl || null,
        category: item.category || 'General',
        orderIndex: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      createdItems.push(newItem);
      list.unshift(newItem);

      try {
        await db.insert(charityGallery).values({
          id: newItem.id,
          title: newItem.title,
          caption: newItem.caption,
          mediaType: newItem.mediaType,
          mediaUrl: newItem.mediaUrl,
          thumbnailUrl: newItem.thumbnailUrl,
          category: newItem.category,
          orderIndex: newItem.orderIndex,
        });
      } catch (_) {}
    }

    writeFallbackGallery(list);
    res.status(201).json({ success: true, count: createdItems.length, items: createdItems });
  } catch (err: any) {
    console.error('[CHARITY GALLERY] Batch create error:', err);
    res.status(500).json({ error: 'Failed to batch create gallery items', details: err.message });
  }
});

// ==========================================
// 3. UPDATE GALLERY ITEM (Protected)
// ==========================================
router.put('/:id', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, caption, mediaType, mediaUrl, thumbnailUrl, category, orderIndex } = req.body;

    const list = readFallbackGallery();
    const idx = list.findIndex(i => i.id === id);
    let updated: any = idx >= 0 ? { ...list[idx] } : { id };

    if (title !== undefined) updated.title = title.trim();
    if (caption !== undefined) updated.caption = caption ? caption.trim() : null;
    if (mediaType !== undefined) updated.mediaType = mediaType;
    if (mediaUrl !== undefined) updated.mediaUrl = mediaUrl;
    if (thumbnailUrl !== undefined) updated.thumbnailUrl = thumbnailUrl;
    if (category !== undefined) updated.category = category;
    if (orderIndex !== undefined) updated.orderIndex = Number(orderIndex);
    updated.updatedAt = new Date().toISOString();

    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    writeFallbackGallery(list);

    try {
      await db.update(charityGallery).set(updated).where(eq(charityGallery.id, id));
    } catch (_) {}

    res.json(updated);
  } catch (err: any) {
    console.error('[CHARITY GALLERY] Update error:', err);
    res.status(500).json({ error: 'Failed to update gallery item', details: err.message });
  }
});

// ==========================================
// 4. DELETE GALLERY ITEM (Protected)
// ==========================================
router.delete('/:id', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const list = readFallbackGallery().filter(i => i.id !== id);
    writeFallbackGallery(list);

    try {
      await db.delete(charityGallery).where(eq(charityGallery.id, id));
    } catch (_) {}

    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err: any) {
    console.error('[CHARITY GALLERY] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete gallery item', details: err.message });
  }
});

export default router;
