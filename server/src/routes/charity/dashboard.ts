import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { charityNews, charityGallery, charityMedia, charitySchoolContent, charityPageContent, charityDonation } from '../../db/schema';
import { sql, desc, eq } from 'drizzle-orm';
import { authenticateSession, requireRole } from '../../middlewares/auth';
import path from 'path';
import fs from 'fs';

const router = Router();

function getFallbackDonations(): any[] {
  try {
    const fallbackPath = path.join(process.cwd(), 'public', 'uploads', 'charity', 'donations_store.json');
    if (fs.existsSync(fallbackPath)) {
      return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
  } catch (_) {}
  return [];
}

router.get('/stats', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    // 1. News stats
    const totalNewsResult = await db.select({ count: sql<number>`count(*)` }).from(charityNews);
    const publishedNewsResult = await db.select({ count: sql<number>`count(*)` }).from(charityNews).where(eq(charityNews.status, 'published'));

    // 2. Gallery stats
    const totalGalleryResult = await db.select({ count: sql<number>`count(*)` }).from(charityGallery);
    const galleryImagesResult = await db.select({ count: sql<number>`count(*)` }).from(charityGallery).where(eq(charityGallery.mediaType, 'image'));
    const galleryVideosResult = await db.select({ count: sql<number>`count(*)` }).from(charityGallery).where(eq(charityGallery.mediaType, 'video'));

    // 3. Media library stats
    const totalMediaResult = await db.select({ count: sql<number>`count(*)` }).from(charityMedia);
    const mediaImagesResult = await db.select({ count: sql<number>`count(*)` }).from(charityMedia).where(eq(charityMedia.fileType, 'image'));
    const mediaVideosResult = await db.select({ count: sql<number>`count(*)` }).from(charityMedia).where(eq(charityMedia.fileType, 'video'));
    const mediaDocsResult = await db.select({ count: sql<number>`count(*)` }).from(charityMedia).where(eq(charityMedia.fileType, 'document'));

    // 4. Donations stats & recent donations
    let totalDonations = 0;
    let pendingDonations = 0;
    let totalAmountETB = 0;
    let totalAmountUSD = 0;
    let recentDonations: any[] = [];

    try {
      const allDonations = await db.select().from(charityDonation).orderBy(desc(charityDonation.createdAt));
      totalDonations = allDonations.length;
      pendingDonations = allDonations.filter((d: any) => d.status === 'pending').length;
      totalAmountETB = allDonations
        .filter((d: any) => d.currency === 'ETB' && d.status !== 'rejected')
        .reduce((sum: number, d: any) => sum + (parseFloat(String(d.amount)) || 0), 0);
      totalAmountUSD = allDonations
        .filter((d: any) => d.currency === 'USD' && d.status !== 'rejected')
        .reduce((sum: number, d: any) => sum + (parseFloat(String(d.amount)) || 0), 0);
      recentDonations = allDonations.slice(0, 5);
    } catch (_) {
      const fallbackList = getFallbackDonations();
      totalDonations = fallbackList.length;
      pendingDonations = fallbackList.filter((d: any) => d.status === 'pending').length;
      totalAmountETB = fallbackList
        .filter((d: any) => (d.currency || 'ETB') === 'ETB' && d.status !== 'rejected')
        .reduce((sum: number, d: any) => sum + (parseFloat(String(d.amount)) || 0), 0);
      totalAmountUSD = fallbackList
        .filter((d: any) => d.currency === 'USD' && d.status !== 'rejected')
        .reduce((sum: number, d: any) => sum + (parseFloat(String(d.amount)) || 0), 0);
      recentDonations = fallbackList.slice(0, 5);
    }

    // 5. Recent News (latest 5)
    const recentNews = await db
      .select({
        id: charityNews.id,
        slug: charityNews.slug,
        title: charityNews.title,
        category: charityNews.category,
        status: charityNews.status,
        featuredImageUrl: charityNews.featuredImageUrl,
        publishedAt: charityNews.publishedAt,
        createdAt: charityNews.createdAt,
      })
      .from(charityNews)
      .orderBy(desc(charityNews.createdAt))
      .limit(5);

    // 6. Recent Media Uploads (latest 6)
    const recentUploads = await db
      .select({
        id: charityMedia.id,
        name: charityMedia.name,
        url: charityMedia.url,
        fileType: charityMedia.fileType,
        sizeBytes: charityMedia.sizeBytes,
        createdAt: charityMedia.createdAt,
      })
      .from(charityMedia)
      .orderBy(desc(charityMedia.createdAt))
      .limit(6);

    res.json({
      stats: {
        donations: {
          total: totalDonations,
          pending: pendingDonations,
          totalAmountETB,
          totalAmountUSD,
        },
        news: {
          total: Number(totalNewsResult[0]?.count || 0),
          published: Number(publishedNewsResult[0]?.count || 0),
        },
        gallery: {
          total: Number(totalGalleryResult[0]?.count || 0),
          images: Number(galleryImagesResult[0]?.count || 0),
          videos: Number(galleryVideosResult[0]?.count || 0),
        },
        media: {
          total: Number(totalMediaResult[0]?.count || 0),
          images: Number(mediaImagesResult[0]?.count || 0),
          videos: Number(mediaVideosResult[0]?.count || 0),
          documents: Number(mediaDocsResult[0]?.count || 0),
        },
      },
      recentDonations,
      recentNews,
      recentUploads,
    });
  } catch (err: any) {
    console.error('[CHARITY DASHBOARD] Failed to fetch stats:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats', details: err.message });
  }
});

export default router;
