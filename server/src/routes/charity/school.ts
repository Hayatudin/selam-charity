import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { charitySchoolContent } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { authenticateSession, requireRole } from '../../middlewares/auth';

const router = Router();

const DEFAULT_SECTIONS: Record<string, { title: string; subtitle: string; content: string; mediaUrls: string[]; metadata: any }> = {
  intro: {
    title: 'Welcome to Selam School',
    subtitle: 'Nurturing minds, inspiring character, and equipping the next generation',
    content: 'Selam School provides holistic, value-based education for children, fostering intellectual growth, creativity, and moral integrity. Our classrooms are designed to cultivate critical thinking, curiosity, and compassion.',
    mediaUrls: [],
    metadata: {
      studentCapacity: 650,
      teacherCount: 42,
      establishedYear: 2012,
      gradesCovered: 'Kindergarten to Grade 8',
    },
  },
  programs: {
    title: 'Academic & Enrichment Programs',
    subtitle: 'Comprehensive curriculum tailored to foster whole-child development',
    content: 'We offer robust educational pathways combining rigorous core academics with STEM, languages, arts, and vocational foundation skills.',
    mediaUrls: [],
    metadata: {
      programsList: [
        { name: 'Early Childhood Education (KG)', description: 'Play-based foundational learning focusing on early literacy and socialization.' },
        { name: 'Primary School (Grades 1-4)', description: 'Building fundamental literacy, mathematics, and natural science competencies.' },
        { name: 'Middle School (Grades 5-8)', description: 'Advanced subject preparation, laboratory experiments, and critical reasoning.' },
        { name: 'Special Support & Tutoring', description: 'After-school tutoring and nutritional meal support for vulnerable children.' },
      ],
    },
  },
  activities: {
    title: 'Co-Curricular & Student Activities',
    subtitle: 'Sports, leadership clubs, arts, and community engagement',
    content: 'Learning extends far beyond textbooks. Our vibrant co-curricular clubs and athletic competitions help students discover their passions, build teamwork, and cultivate leadership.',
    mediaUrls: [],
    metadata: {
      activitiesList: [
        { name: 'Debate & Public Speaking', schedule: 'Tuesdays & Thursdays' },
        { name: 'Football & Athletics Club', schedule: 'Wednesdays & Saturdays' },
        { name: 'Art & Cultural Performance', schedule: 'Fridays' },
        { name: 'Environmental & Green Gardening Club', schedule: 'Weekly' },
      ],
    },
  },
  facilities: {
    title: 'School Facilities & Campus Life',
    subtitle: 'Modern, safe, and inspiring learning spaces',
    content: 'Our campus features well-lit modern classrooms, a dedicated science and ICT laboratory, a stocked library, and open playgrounds for safe recreation.',
    mediaUrls: [],
    metadata: {
      facilitiesList: [
        { name: 'Science & Computer Lab', description: 'Equipped with modern workstations and scientific apparatus.' },
        { name: 'Library & Resource Hub', description: 'Over 3,000 books, periodicals, and quiet reading study spaces.' },
        { name: 'Sports Field & Playground', description: 'Dedicated football pitch and safe kindergarten playground equipment.' },
        { name: 'Cafeteria & Dining Hall', description: 'Clean kitchen serving healthy daily lunches and snacks.' },
      ],
    },
  },
};

// Local JSON fallback store for school content
import path from 'path';
import fs from 'fs';

const schoolFallbackPath = path.join(process.cwd(), 'public', 'uploads', 'charity', 'school_store.json');
function readFallbackSchool(): Record<string, any> {
  try {
    if (fs.existsSync(schoolFallbackPath)) {
      return JSON.parse(fs.readFileSync(schoolFallbackPath, 'utf8'));
    }
  } catch (_) {}
  return {};
}

function writeFallbackSchool(data: Record<string, any>) {
  try {
    const dir = path.dirname(schoolFallbackPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(schoolFallbackPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[CHARITY SCHOOL] Failed to save fallback store:', err);
  }
}

// ==========================================
// 1. GET ALL SCHOOL SECTIONS
// ==========================================
router.get('/', async (req: Request, res: Response) => {
  const fallback = readFallbackSchool();
  try {
    const existing = await db.select().from(charitySchoolContent);

    // Map existing into an object dictionary keyed by sectionKey
    const map: Record<string, any> = { ...fallback };
    existing.forEach((s) => {
      map[s.sectionKey] = s;
    });

    // Fill in defaults for any un-configured sections
    const sections: Record<string, any> = {};
    for (const key of ['intro', 'programs', 'activities', 'facilities']) {
      if (map[key]) {
        sections[key] = map[key];
      } else {
        sections[key] = {
          sectionKey: key,
          ...DEFAULT_SECTIONS[key],
          isDefault: true,
        };
      }
    }

    res.json(sections);
  } catch (err: any) {
    console.warn('[CHARITY SCHOOL] Falling back to default/local content:', err.message);
    const sections: Record<string, any> = {};
    for (const key of ['intro', 'programs', 'activities', 'facilities']) {
      sections[key] = fallback[key] || {
        sectionKey: key,
        ...DEFAULT_SECTIONS[key],
        isDefault: true,
      };
    }
    res.json(sections);
  }
});

// ==========================================
// 2. GET SINGLE SECTION
// ==========================================
router.get('/:sectionKey', async (req: Request, res: Response) => {
  const { sectionKey } = req.params;
  const fallback = readFallbackSchool();

  try {
    const section = await db.query.charitySchoolContent.findFirst({
      where: eq(charitySchoolContent.sectionKey, sectionKey),
    });

    if (section) {
      return res.json(section);
    }
  } catch (err: any) {
    console.warn(`[CHARITY SCHOOL] Get single DB fallback for ${sectionKey}`);
  }

  if (fallback[sectionKey]) {
    return res.json(fallback[sectionKey]);
  }

  if (DEFAULT_SECTIONS[sectionKey]) {
    return res.json({
      sectionKey,
      ...DEFAULT_SECTIONS[sectionKey],
      isDefault: true,
    });
  }

  res.status(404).json({ error: 'Section not found' });
});

// ==========================================
// 3. UPSERT SECTION (Protected)
// ==========================================
router.put('/:sectionKey', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { sectionKey } = req.params;
    const { title, subtitle, content, mediaUrls, metadata } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const payload = {
      sectionKey,
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : null,
      content: content || '',
      mediaUrls: mediaUrls || [],
      metadata: metadata || {},
      updatedAt: new Date().toISOString(),
    };

    // Save to local fallback store
    const currentFallback = readFallbackSchool();
    currentFallback[sectionKey] = payload;
    writeFallbackSchool(currentFallback);

    try {
      const existing = await db.query.charitySchoolContent.findFirst({
        where: eq(charitySchoolContent.sectionKey, sectionKey),
      });

      if (existing) {
        await db
          .update(charitySchoolContent)
          .set({ ...payload, updatedAt: new Date() } as any)
          .where(eq(charitySchoolContent.sectionKey, sectionKey));
      } else {
        await db.insert(charitySchoolContent).values({ ...payload, updatedAt: new Date() } as any);
      }

      const saved = await db.query.charitySchoolContent.findFirst({
        where: eq(charitySchoolContent.sectionKey, sectionKey),
      });

      if (saved) return res.json(saved);
    } catch (dbErr: any) {
      console.warn('[CHARITY SCHOOL] DB save failed, saved to fallback store:', dbErr.message);
    }

    res.json(payload);
  } catch (err: any) {
    console.error('[CHARITY SCHOOL] Update error:', err);
    res.status(500).json({ error: 'Failed to save school content', details: err.message });
  }
});

export default router;
