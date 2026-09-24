import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { charityCampaign, charityDonation, charityProject, charityVolunteer } from '../../db/schema';
import { desc, eq } from 'drizzle-orm';
import { authenticateSession, requireRole } from '../../middlewares/auth';

import dashboardRoutes from './dashboard';
import newsRoutes from './news';
import galleryRoutes from './gallery';
import mediaRoutes from './media';
import schoolRoutes from './school';
import pagesRoutes from './pages';
import donationsRoutes from './donations';

const router = Router();

// ==========================================
// 1. CHARITY MODULE HEALTH & SUMMARY
// ==========================================
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    module: 'Charity CMS API',
    endpoints: [
      '/dashboard/stats',
      '/news',
      '/gallery',
      '/media',
      '/school',
      '/pages',
      '/campaigns',
      '/donations',
      '/projects',
      '/volunteers'
    ],
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 2. SUB-ROUTERS
// ==========================================
router.use('/dashboard', dashboardRoutes);
router.use('/news', newsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/media', mediaRoutes);
router.use('/school', schoolRoutes);
router.use('/pages', pagesRoutes);
router.use('/donations', donationsRoutes);

// ==========================================
// 3. PUBLIC CAMPAIGNS & PROJECTS
// ==========================================
router.get('/campaigns', async (req: Request, res: Response) => {
  try {
    const campaigns = await db
      .select()
      .from(charityCampaign)
      .where(eq(charityCampaign.status, 'active'))
      .orderBy(desc(charityCampaign.createdAt));

    res.json(campaigns);
  } catch (err: any) {
    console.error('[CHARITY] Failed to fetch campaigns:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns', details: err.message });
  }
});

router.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects = await db
      .select()
      .from(charityProject)
      .where(eq(charityProject.status, 'active'))
      .orderBy(desc(charityProject.createdAt));

    res.json(projects);
  } catch (err: any) {
    console.error('[CHARITY] Failed to fetch projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// ==========================================
// 4. VOLUNTEER REGISTRATION
// ==========================================
router.post('/volunteers', async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, skills, interests, availability } = req.body;
    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Full name, email, and phone number are required' });
    }

    await db.insert(charityVolunteer).values({
      fullName,
      email,
      phone,
      skills: skills || [],
      interests: interests || null,
      availability: availability || 'weekends',
      status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Volunteer application submitted successfully' });
  } catch (err: any) {
    console.error('[CHARITY] Failed to register volunteer:', err);
    res.status(500).json({ error: 'Failed to register volunteer', details: err.message });
  }
});

export default router;
