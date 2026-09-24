import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { charityPageContent } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { authenticateSession, requireRole } from '../../middlewares/auth';

const router = Router();

const DEFAULT_PAGES: Record<string, { title: string; subtitle: string; content: string; bannerImageUrl?: string; metadata: any }> = {
  about: {
    title: 'About Selam Charity Organization',
    subtitle: 'Dedicated to empowering communities, transforming lives, and fostering enduring hope',
    content: 'Founded with a commitment to humanitarian excellence, Selam Charity operates community development, educational scholarships, and emergency aid across regions in need. We believe every person deserves dignity, opportunity, and the resources to thrive.',
    bannerImageUrl: '',
    metadata: {
      foundedYear: 2010,
      headquarters: 'Addis Ababa, Ethiopia',
      coreValues: ['Integrity', 'Compassion', 'Community Empowerment', 'Transparency', 'Sustainability'],
    },
  },
  mission: {
    title: 'Our Mission & Vision',
    subtitle: 'Guided by empathy, executed with purpose and measurable impact',
    content: 'Our mission is to alleviate hardship, provide quality education, and build self-reliant communities through transparent and grassroots humanitarian projects.',
    bannerImageUrl: '',
    metadata: {
      missionStatement: 'To uplift disadvantaged children and families through sustainable education, healthcare access, and economic support.',
      visionStatement: 'A resilient society where every individual has equal opportunity to realize their full potential in peace and dignity.',
      keyPillars: [
        { title: 'Education for All', description: 'Comprehensive school access, materials, and scholarship programs.' },
        { title: 'Community Healthcare', description: 'Mobile medical clinics, maternal support, and health education.' },
        { title: 'Emergency Relief', description: 'Rapid food security and crisis response for affected communities.' },
      ],
    },
  },
  contact: {
    title: 'Contact & Support Information',
    subtitle: 'We are here to answer your questions and partner with compassionate changemakers',
    content: 'Reach out to our main office, explore partnership opportunities, or connect with our volunteer coordinator.',
    bannerImageUrl: '',
    metadata: {
      email: 'contact@selamcharity.org',
      phone: '+251 91 100 2233',
      alternatePhone: '+251 11 661 4455',
      address: 'Bole Subcity, Woreda 03, House No. 412, Addis Ababa, Ethiopia',
      officeHours: 'Monday - Friday: 8:30 AM - 5:30 PM (EAT)',
      socialLinks: {
        facebook: 'https://facebook.com/selamcharity',
        twitter: 'https://twitter.com/selamcharity',
        instagram: 'https://instagram.com/selamcharity',
        telegram: 'https://t.me/selamcharity',
      },
    },
  },
  general: {
    title: 'General Organization Information',
    subtitle: 'Registration details, governance, and annual reports',
    content: 'Selam Charity is a legally certified indigenous civil society organization operating under regulatory oversight with annual independent audits.',
    bannerImageUrl: '',
    metadata: {
      registrationNumber: 'CSO-ETH-2010-8849',
      taxExemptStatus: 'Approved NGO status',
    },
  },
};

// Local JSON fallback store for pages
import path from 'path';
import fs from 'fs';

const pagesFallbackPath = path.join(process.cwd(), 'public', 'uploads', 'charity', 'pages_store.json');
function readFallbackPages(): Record<string, any> {
  try {
    if (fs.existsSync(pagesFallbackPath)) {
      return JSON.parse(fs.readFileSync(pagesFallbackPath, 'utf8'));
    }
  } catch (_) {}
  return {};
}

function writeFallbackPages(data: Record<string, any>) {
  try {
    const dir = path.dirname(pagesFallbackPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(pagesFallbackPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[CHARITY PAGES] Failed to save fallback store:', err);
  }
}

// ==========================================
// 1. GET ALL CMS PAGES
// ==========================================
router.get('/', async (req: Request, res: Response) => {
  const fallback = readFallbackPages();
  try {
    const existing = await db.select().from(charityPageContent);

    const map: Record<string, any> = { ...fallback };
    existing.forEach((p) => {
      map[p.pageKey] = p;
    });

    const pages: Record<string, any> = {};
    for (const key of ['about', 'mission', 'contact', 'general']) {
      if (map[key]) {
        pages[key] = map[key];
      } else {
        pages[key] = {
          pageKey: key,
          ...DEFAULT_PAGES[key],
          isDefault: true,
        };
      }
    }

    res.json(pages);
  } catch (err: any) {
    console.warn('[CHARITY PAGES] Falling back to default/local content:', err.message);
    const pages: Record<string, any> = {};
    for (const key of ['about', 'mission', 'contact', 'general']) {
      pages[key] = fallback[key] || {
        pageKey: key,
        ...DEFAULT_PAGES[key],
        isDefault: true,
      };
    }
    res.json(pages);
  }
});

// ==========================================
// 2. GET SINGLE PAGE
// ==========================================
router.get('/:pageKey', async (req: Request, res: Response) => {
  const { pageKey } = req.params;
  const fallback = readFallbackPages();

  try {
    const page = await db.query.charityPageContent.findFirst({
      where: eq(charityPageContent.pageKey, pageKey),
    });

    if (page) {
      return res.json(page);
    }
  } catch (err: any) {
    console.warn(`[CHARITY PAGES] Get single DB fallback for ${pageKey}`);
  }

  if (fallback[pageKey]) {
    return res.json(fallback[pageKey]);
  }

  if (DEFAULT_PAGES[pageKey]) {
    return res.json({
      pageKey,
      ...DEFAULT_PAGES[pageKey],
      isDefault: true,
    });
  }

  res.status(404).json({ error: 'Page not found' });
});

// ==========================================
// 3. UPSERT PAGE CONTENT (Protected)
// ==========================================
router.put('/:pageKey', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { pageKey } = req.params;
    const { title, subtitle, content, bannerImageUrl, metadata } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const payload = {
      pageKey,
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : null,
      content: content || '',
      bannerImageUrl: bannerImageUrl || null,
      metadata: metadata || {},
      updatedAt: new Date().toISOString(),
    };

    // Save to local fallback store
    const currentFallback = readFallbackPages();
    currentFallback[pageKey] = payload;
    writeFallbackPages(currentFallback);

    try {
      const existing = await db.query.charityPageContent.findFirst({
        where: eq(charityPageContent.pageKey, pageKey),
      });

      if (existing) {
        await db
          .update(charityPageContent)
          .set({ ...payload, updatedAt: new Date() } as any)
          .where(eq(charityPageContent.pageKey, pageKey));
      } else {
        await db.insert(charityPageContent).values({ ...payload, updatedAt: new Date() } as any);
      }

      const saved = await db.query.charityPageContent.findFirst({
        where: eq(charityPageContent.pageKey, pageKey),
      });

      if (saved) return res.json(saved);
    } catch (dbErr: any) {
      console.warn('[CHARITY PAGES] DB save failed, saved to fallback store:', dbErr.message);
    }

    res.json(payload);
  } catch (err: any) {
    console.error('[CHARITY PAGES] Update error:', err);
    res.status(500).json({ error: 'Failed to save page content', details: err.message });
  }
});

// ==========================================
// 4. SUBMIT CONTACT INQUIRY (Public)
// ==========================================
router.post('/contact-message', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, category, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Log the contact inquiry for administrators
    console.log('[CHARITY INQUIRY RECEIVED]', {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || 'N/A',
      category: category || 'General Inquiry',
      subject: subject || 'No subject',
      messagePreview: message.slice(0, 100),
    });

    res.json({
      success: true,
      message: 'Thank you for contacting Selam Charity. Your message has been received and our team will get back to you shortly.',
    });
  } catch (err: any) {
    console.error('[CHARITY CONTACT] Submission error:', err);
    res.status(500).json({ error: 'Failed to submit contact message', details: err.message });
  }
});

export default router;

