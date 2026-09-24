import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { charityNews } from '../../db/schema';
import { eq, desc, like, or, and, sql } from 'drizzle-orm';
import { authenticateSession, requireRole } from '../../middlewares/auth';
import { getSession } from '../../lib/auth-helper';

import path from 'path';
import fs from 'fs';
import { createId } from '@paralleldrive/cuid2';

const router = Router();

const newsFallbackPath = path.join(process.cwd(), 'public', 'uploads', 'charity', 'news_store.json');
function readFallbackNews(): any[] {
  try {
    if (fs.existsSync(newsFallbackPath)) {
      return JSON.parse(fs.readFileSync(newsFallbackPath, 'utf8'));
    }
  } catch (_) {}
  return [];
}
function writeFallbackNews(data: any[]) {
  try {
    const dir = path.dirname(newsFallbackPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(newsFallbackPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[CHARITY NEWS] Failed to save fallback store:', err);
  }
}

// Helper to generate URL-safe slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ==========================================
// 1. LIST NEWS (Public or Admin)
// ==========================================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, category, search, limit, offset } = req.query;

    const conditions = [];

    if (status && typeof status === 'string' && status !== 'all') {
      conditions.push(eq(charityNews.status, status));
    }

    if (category && typeof category === 'string' && category !== 'all') {
      conditions.push(eq(charityNews.category, category));
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          like(charityNews.title, term),
          like(charityNews.excerpt, term),
          like(charityNews.content, term)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const query = db
      .select()
      .from(charityNews)
      .where(whereClause)
      .orderBy(desc(charityNews.createdAt));

    if (limit && !isNaN(Number(limit))) {
      query.limit(Number(limit));
    }

    if (offset && !isNaN(Number(offset))) {
      query.offset(Number(offset));
    }

    let newsList: any[] = [];
    try {
      newsList = await query;
    } catch (_) {
      newsList = readFallbackNews();
    }
    if (!newsList || newsList.length === 0) {
      newsList = readFallbackNews();
    }

    if (status && typeof status === 'string' && status !== 'all') {
      newsList = newsList.filter(n => n.status === status);
    }
    if (category && typeof category === 'string' && category !== 'all') {
      newsList = newsList.filter(n => n.category === category);
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      newsList = newsList.filter(n => 
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.excerpt && n.excerpt.toLowerCase().includes(q)) ||
        (n.content && n.content.toLowerCase().includes(q))
      );
    }

    res.json(newsList);
  } catch (err: any) {
    console.warn('[CHARITY NEWS] Falling back to local news list:', err.message);
    res.json(readFallbackNews());
  }
});

// ==========================================
// 2. GET NEWS BY ID OR SLUG
// ==========================================
router.get('/:idOrSlug', async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const fallbackList = readFallbackNews();

  try {
    const article = await db.query.charityNews.findFirst({
      where: or(
        eq(charityNews.id, idOrSlug),
        eq(charityNews.slug, idOrSlug)
      ),
    });

    if (article) {
      return res.json(article);
    }
  } catch (err: any) {
    console.warn(`[CHARITY NEWS] DB fetch fallback for ${idOrSlug}`);
  }

  const fallbackArticle = fallbackList.find(n => n.id === idOrSlug || n.slug === idOrSlug);
  if (fallbackArticle) {
    return res.json(fallbackArticle);
  }

  res.status(404).json({ error: 'News article not found' });
});

// ==========================================
// 3. CREATE NEWS (Protected)
// ==========================================
router.post('/', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const { title, slug: customSlug, excerpt, content, category, featuredImageUrl, status, publishedAt, authorName } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    let slug = (customSlug && customSlug.trim()) ? slugify(customSlug) : slugify(title);
    if (!slug) slug = `news-${Date.now()}`;

    const postStatus = status === 'published' ? 'published' : 'draft';
    const pubDate = postStatus === 'published' ? (publishedAt ? new Date(publishedAt) : new Date()) : null;

    const newId = createId();
    const articlePayload: any = {
      id: newId,
      slug,
      title: title.trim(),
      excerpt: excerpt?.trim() || null,
      content,
      category: category || 'General',
      featuredImageUrl: featuredImageUrl || null,
      status: postStatus,
      publishedAt: pubDate ? pubDate.toISOString() : null,
      authorId: (authorName && authorName.trim()) ? authorName.trim() : (session?.user?.name || 'Selam Team'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
    };

    // Save to fallback store
    const list = readFallbackNews();
    list.unshift(articlePayload);
    writeFallbackNews(list);

    // Also attempt DB insert
    try {
      await db.insert(charityNews).values({
        id: articlePayload.id,
        slug: articlePayload.slug,
        title: articlePayload.title,
        excerpt: articlePayload.excerpt,
        content: articlePayload.content,
        category: articlePayload.category,
        featuredImageUrl: articlePayload.featuredImageUrl,
        status: articlePayload.status,
        publishedAt: pubDate,
        authorId: articlePayload.authorId,
      });
    } catch (dbErr: any) {
      console.warn('[CHARITY NEWS] DB insert warning, saved to fallback store:', dbErr.message);
    }

    res.status(201).json(articlePayload);
  } catch (err: any) {
    console.error('[CHARITY NEWS] Create error:', err);
    res.status(500).json({ error: 'Failed to create news article', details: err.message });
  }
});

// ==========================================
// 4. UPDATE NEWS (Protected)
// ==========================================
router.put('/:id', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug: customSlug, excerpt, content, category, featuredImageUrl, status, publishedAt, authorName } = req.body;

    // Update in fallback store
    const list = readFallbackNews();
    const idx = list.findIndex(n => n.id === id);
    let updatedPayload: any = idx >= 0 ? { ...list[idx] } : { id };

    if (title !== undefined) updatedPayload.title = title.trim();
    if (excerpt !== undefined) updatedPayload.excerpt = excerpt ? excerpt.trim() : null;
    if (content !== undefined) updatedPayload.content = content;
    if (category !== undefined) updatedPayload.category = category;
    if (featuredImageUrl !== undefined) updatedPayload.featuredImageUrl = featuredImageUrl;
    if (authorName !== undefined) updatedPayload.authorId = authorName ? authorName.trim() : 'Selam Team';
    if (customSlug) updatedPayload.slug = slugify(customSlug);
    if (status !== undefined) updatedPayload.status = status;
    if (publishedAt !== undefined) updatedPayload.publishedAt = publishedAt;
    updatedPayload.updatedAt = new Date().toISOString();

    if (idx >= 0) {
      list[idx] = updatedPayload;
      writeFallbackNews(list);
    }

    try {
      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (excerpt !== undefined) updateData.excerpt = excerpt ? excerpt.trim() : null;
      if (content !== undefined) updateData.content = content;
      if (category !== undefined) updateData.category = category;
      if (featuredImageUrl !== undefined) updateData.featuredImageUrl = featuredImageUrl;
      if (authorName !== undefined) updateData.authorId = authorName ? authorName.trim() : 'Selam Team';
      if (customSlug) updateData.slug = slugify(customSlug);
      if (status !== undefined) updateData.status = status;
      if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;

      await db.update(charityNews).set(updateData).where(eq(charityNews.id, id));
    } catch (dbErr: any) {
      console.warn('[CHARITY NEWS] DB update warning:', dbErr.message);
    }

    res.json(updatedPayload);
  } catch (err: any) {
    console.error('[CHARITY NEWS] Update error:', err);
    res.status(500).json({ error: 'Failed to update news article', details: err.message });
  }
});

// ==========================================
// 5. TOGGLE PUBLISH STATUS (Protected)
// ==========================================
router.patch('/:id/toggle-publish', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const list = readFallbackNews();
    const idx = list.findIndex(n => n.id === id);
    let nextStatus = 'published';
    let nextPublishedAt = new Date().toISOString();

    if (idx >= 0) {
      nextStatus = list[idx].status === 'published' ? 'draft' : 'published';
      nextPublishedAt = nextStatus === 'published' ? new Date().toISOString() : null as any;
      list[idx].status = nextStatus;
      list[idx].publishedAt = nextPublishedAt;
      writeFallbackNews(list);
    }

    try {
      const existing = await db.query.charityNews.findFirst({
        where: eq(charityNews.id, id),
      });

      if (existing) {
        nextStatus = existing.status === 'published' ? 'draft' : 'published';
        const pubDate = nextStatus === 'published' ? new Date() : null;

        await db.update(charityNews)
          .set({
            status: nextStatus,
            publishedAt: pubDate,
          })
          .where(eq(charityNews.id, id));
      }
    } catch (dbErr: any) {
      console.warn('[CHARITY NEWS] DB toggle warning:', dbErr.message);
    }

    res.json({ id, status: nextStatus, publishedAt: nextPublishedAt });
  } catch (err: any) {
    console.error('[CHARITY NEWS] Toggle error:', err);
    res.status(500).json({ error: 'Failed to toggle publication status', details: err.message });
  }
});

// ==========================================
// 6. DELETE NEWS (Protected)
// ==========================================
router.delete('/:id', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const list = readFallbackNews().filter(n => n.id !== id);
    writeFallbackNews(list);

    try {
      await db.delete(charityNews).where(eq(charityNews.id, id));
    } catch (dbErr: any) {
      console.warn('[CHARITY NEWS] DB delete warning:', dbErr.message);
    }

    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (err: any) {
    console.error('[CHARITY NEWS] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete news article', details: err.message });
  }
});

export default router;
