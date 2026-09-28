import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { scholarshipApplication } from '../../db/schema';
import { eq, desc, and, or, like, sql } from 'drizzle-orm';
import { authenticateSession, requireRole } from '../../middlewares/auth';
import { uploadFileFromDisk, getUploadsRoot, isLocalStorage } from '../../lib/upload';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { createId } from '@paralleldrive/cuid2';

const router = Router();

// Configure multer temp directory
const tempUploadDir = os.tmpdir();
const upload = multer({
  dest: tempUploadDir,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit for combined PDF
});

// JSON fallback store for offline development
const fallbackStorePath = path.join(getUploadsRoot(), 'charity', 'scholarship_applications_store.json');

function ensureFallbackDir() {
  const dir = path.dirname(fallbackStorePath);
  if (!fs.existsSync(dir)) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch (_) {}
  }
}

function readFallbackApplications(): any[] {
  try {
    ensureFallbackDir();
    if (fs.existsSync(fallbackStorePath)) {
      const data = fs.readFileSync(fallbackStorePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (_) {}
  return [];
}

function writeFallbackApplications(apps: any[]) {
  try {
    ensureFallbackDir();
    fs.writeFileSync(fallbackStorePath, JSON.stringify(apps, null, 2), 'utf8');
  } catch (err) {
    console.error('[APPLICATIONS] Failed to write fallback store:', err);
  }
}

// Self-healing table check
let tableChecked = false;
async function ensureApplicationsTable() {
  if (tableChecked) return;
  try {
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS ScholarshipApplication (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        applicationNumber VARCHAR(50) NOT NULL UNIQUE,
        fullName VARCHAR(255) NOT NULL,
        gender VARCHAR(50) NOT NULL,
        placeOfBirth VARCHAR(255) NULL,
        dateOfBirth VARCHAR(50) NOT NULL,
        contactAddress TEXT NOT NULL,
        phoneNumber VARCHAR(50) NOT NULL,
        email VARCHAR(255) NULL,
        nationalIdNumber VARCHAR(100) NULL,
        employer VARCHAR(255) NOT NULL,
        jobTitle VARCHAR(255) NOT NULL,
        department VARCHAR(255) NULL,
        employmentType VARCHAR(50) NULL DEFAULT 'Full-time Permanent',
        workLocation VARCHAR(255) NOT NULL,
        yearsOfService VARCHAR(50) NOT NULL,
        highestEducation VARCHAR(100) NOT NULL,
        undergraduateUniversity VARCHAR(255) NOT NULL,
        undergraduateField VARCHAR(255) NOT NULL,
        undergraduateCgpa VARCHAR(50) NOT NULL,
        graduationYear VARCHAR(50) NOT NULL,
        targetDegree VARCHAR(50) NOT NULL,
        targetUniversity VARCHAR(255) NOT NULL,
        targetField VARCHAR(255) NOT NULL,
        enrollmentStatus VARCHAR(50) NULL,
        programDuration VARCHAR(50) NULL,
        academicYear VARCHAR(50) NULL,
        scholarshipType VARCHAR(100) NULL,
        requestedAmount VARCHAR(100) NULL,
        motivationStatement LONGTEXT NULL,
        communityImpact LONGTEXT NULL,
        hasCostSharing TINYINT(1) NULL DEFAULT 0,
        costSharingDocRef VARCHAR(255) NULL,
        documentUrl TEXT NULL,
        declarationAgreed TINYINT(1) NULL DEFAULT 1,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        adminNotes TEXT NULL,
        reviewedBy VARCHAR(191) NULL,
        reviewedAt DATETIME(3) NULL,
        createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        INDEX ScholarshipApplication_status_idx (status),
        INDEX ScholarshipApplication_fullName_idx (fullName),
        INDEX ScholarshipApplication_phone_idx (phoneNumber),
        INDEX ScholarshipApplication_createdAt_idx (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `));
    tableChecked = true;
    console.log('✅ [APPLICATIONS] ScholarshipApplication table verified.');
  } catch (err: any) {
    console.warn('⚠️ [APPLICATIONS] DB check notice, fallback active:', err.message);
  }
}

ensureApplicationsTable().catch(() => {});

// ==========================================
// 1. PUBLIC: SUBMIT APPLICATION
// ==========================================
router.post('/submit', upload.single('document'), async (req: Request, res: Response) => {
  try {
    await ensureApplicationsTable();

    const {
      fullName,
      gender,
      placeOfBirth,
      dateOfBirth,
      contactAddress,
      phoneNumber,
      email,
      nationalIdNumber,
      employer,
      jobTitle,
      department,
      employmentType,
      workLocation,
      yearsOfService,
      highestEducation,
      undergraduateUniversity,
      undergraduateField,
      undergraduateCgpa,
      graduationYear,
      targetDegree,
      targetUniversity,
      targetField,
      enrollmentStatus,
      programDuration,
      academicYear,
      scholarshipType,
      requestedAmount,
      motivationStatement,
      communityImpact,
      hasCostSharing,
      costSharingDocRef,
      declarationAgreed,
    } = req.body;

    if (!fullName || !gender || !dateOfBirth || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required personal information' });
    }

    let documentUrl = null;
    if (req.file) {
      console.log(`[APPLICATIONS] Processing combined document: ${req.file.originalname}, size=${req.file.size}`);
      try {
        documentUrl = await uploadFileFromDisk(req.file.path, 'charity/applications', req.file.originalname);
      } catch (uploadErr: any) {
        console.error('[APPLICATIONS] Upload error:', uploadErr);
        // Clean up temp file
        try { if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); } catch (_) {}
        return res.status(500).json({ error: 'Failed to upload document file: ' + uploadErr.message });
      }
    }

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const applicationNumber = `SELAM-${year}-${randomSuffix}`;
    const newId = createId();

    const record = {
      id: newId,
      applicationNumber,
      fullName: String(fullName).trim(),
      gender: String(gender).trim(),
      placeOfBirth: placeOfBirth ? String(placeOfBirth).trim() : null,
      dateOfBirth: String(dateOfBirth).trim(),
      contactAddress: String(contactAddress || '').trim(),
      phoneNumber: String(phoneNumber).trim(),
      email: email ? String(email).trim() : null,
      nationalIdNumber: nationalIdNumber ? String(nationalIdNumber).trim() : null,
      employer: String(employer || '').trim(),
      jobTitle: String(jobTitle || '').trim(),
      department: department ? String(department).trim() : null,
      employmentType: String(employmentType || 'Full-time Permanent'),
      workLocation: String(workLocation || '').trim(),
      yearsOfService: String(yearsOfService || '').trim(),
      highestEducation: String(highestEducation || "Bachelor's Degree"),
      undergraduateUniversity: String(undergraduateUniversity || '').trim(),
      undergraduateField: String(undergraduateField || '').trim(),
      undergraduateCgpa: String(undergraduateCgpa || '').trim(),
      graduationYear: String(graduationYear || '').trim(),
      targetDegree: String(targetDegree || "Master's Degree"),
      targetUniversity: String(targetUniversity || '').trim(),
      targetField: String(targetField || '').trim(),
      enrollmentStatus: String(enrollmentStatus || 'Admitted / Accepted'),
      programDuration: String(programDuration || '2 Years'),
      academicYear: String(academicYear || '2026/2027'),
      scholarshipType: String(scholarshipType || 'Full Tuition Support'),
      requestedAmount: requestedAmount ? String(requestedAmount).trim() : null,
      motivationStatement: motivationStatement ? String(motivationStatement).trim() : null,
      communityImpact: communityImpact ? String(communityImpact).trim() : null,
      hasCostSharing: hasCostSharing === 'true' || hasCostSharing === true,
      costSharingDocRef: costSharingDocRef ? String(costSharingDocRef).trim() : null,
      documentUrl,
      declarationAgreed: declarationAgreed === 'true' || declarationAgreed === true,
      status: 'pending',
      adminNotes: null,
      reviewedBy: null,
      reviewedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to DB
    let savedToDb = false;
    try {
      await db.insert(scholarshipApplication).values(record as any);
      savedToDb = true;
    } catch (dbErr: any) {
      console.warn('⚠️ [APPLICATIONS] DB insert failed, writing to fallback store:', dbErr.message);
      const fallbackList = readFallbackApplications();
      fallbackList.unshift(record);
      writeFallbackApplications(fallbackList);
    }

    res.status(201).json({
      success: true,
      id: newId,
      applicationNumber,
      savedToDb,
      message: 'Scholarship application submitted successfully.',
    });
  } catch (err: any) {
    console.error('[APPLICATIONS] Submission error:', err);
    res.status(500).json({ error: 'Server error processing application: ' + err.message });
  }
});

// ==========================================
// 2. ADMIN: GET ALL APPLICATIONS (LIST & STATS)
// ==========================================
router.get(
  '/',
  authenticateSession,
  requireRole(['super_admin', 'charity_admin', 'admin', 'genaral', 'user']),
  async (req: Request, res: Response) => {
    try {
      await ensureApplicationsTable();

      const { status, degree, search, page = '1', limit = '50' } = req.query;
      const pageNum = parseInt(String(page), 10) || 1;
      const limitNum = parseInt(String(limit), 10) || 50;
      const offset = (pageNum - 1) * limitNum;

      let applications: any[] = [];
      let totalCount = 0;

      try {
        let conditions: any[] = [];
        if (status && status !== 'all') {
          conditions.push(eq(scholarshipApplication.status, String(status)));
        }
        if (degree && degree !== 'all') {
          conditions.push(like(scholarshipApplication.targetDegree, `%${String(degree)}%`));
        }
        if (search) {
          const s = `%${String(search).trim()}%`;
          conditions.push(
            or(
              like(scholarshipApplication.fullName, s),
              like(scholarshipApplication.email, s),
              like(scholarshipApplication.phoneNumber, s),
              like(scholarshipApplication.applicationNumber, s),
              like(scholarshipApplication.targetUniversity, s)
            )
          );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        applications = await db
          .select()
          .from(scholarshipApplication)
          .where(whereClause)
          .orderBy(desc(scholarshipApplication.createdAt))
          .limit(limitNum)
          .offset(offset);

        // Fetch counts for statistics
        const allRows = await db.select({
          status: scholarshipApplication.status,
          targetDegree: scholarshipApplication.targetDegree,
        }).from(scholarshipApplication);

        const stats = {
          total: allRows.length,
          pending: allRows.filter(r => r.status === 'pending').length,
          under_review: allRows.filter(r => r.status === 'under_review').length,
          approved: allRows.filter(r => r.status === 'approved').length,
          rejected: allRows.filter(r => r.status === 'rejected').length,
          masters: allRows.filter(r => (r.targetDegree || '').toLowerCase().includes('master')).length,
          phd: allRows.filter(r => (r.targetDegree || '').toLowerCase().includes('phd')).length,
        };

        return res.json({
          applications,
          total: allRows.length,
          page: pageNum,
          limit: limitNum,
          stats,
        });
      } catch (dbErr: any) {
        console.warn('⚠️ [APPLICATIONS] DB query error, using fallback:', dbErr.message);
        let fallbackApps = readFallbackApplications();

        if (status && status !== 'all') {
          fallbackApps = fallbackApps.filter(a => a.status === status);
        }
        if (degree && degree !== 'all') {
          fallbackApps = fallbackApps.filter(a => (a.targetDegree || '').toLowerCase().includes(String(degree).toLowerCase()));
        }
        if (search) {
          const s = String(search).toLowerCase();
          fallbackApps = fallbackApps.filter(a => 
            (a.fullName || '').toLowerCase().includes(s) ||
            (a.email || '').toLowerCase().includes(s) ||
            (a.phoneNumber || '').includes(s) ||
            (a.applicationNumber || '').toLowerCase().includes(s)
          );
        }

        const stats = {
          total: fallbackApps.length,
          pending: fallbackApps.filter(a => a.status === 'pending').length,
          under_review: fallbackApps.filter(a => a.status === 'under_review').length,
          approved: fallbackApps.filter(a => a.status === 'approved').length,
          rejected: fallbackApps.filter(a => a.status === 'rejected').length,
          masters: fallbackApps.filter(a => (a.targetDegree || '').toLowerCase().includes('master')).length,
          phd: fallbackApps.filter(a => (a.targetDegree || '').toLowerCase().includes('phd')).length,
        };

        return res.json({
          applications: fallbackApps.slice(offset, offset + limitNum),
          total: fallbackApps.length,
          page: pageNum,
          limit: limitNum,
          stats,
        });
      }
    } catch (err: any) {
      console.error('[APPLICATIONS] Admin fetch error:', err);
      res.status(500).json({ error: 'Failed to load applications: ' + err.message });
    }
  }
);

// ==========================================
// 3. ADMIN: GET SINGLE APPLICATION
// ==========================================
router.get(
  '/:id',
  authenticateSession,
  requireRole(['super_admin', 'charity_admin', 'admin', 'genaral', 'user']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      try {
        const item = await db
          .select()
          .from(scholarshipApplication)
          .where(eq(scholarshipApplication.id, id))
          .limit(1);

        if (item.length > 0) return res.json(item[0]);
      } catch (_) {}

      const fallbackApps = readFallbackApplications();
      const found = fallbackApps.find(a => a.id === id);
      if (found) return res.json(found);

      res.status(404).json({ error: 'Application not found' });
    } catch (err: any) {
      res.status(500).json({ error: 'Error fetching application: ' + err.message });
    }
  }
);

// ==========================================
// 4. ADMIN: UPDATE STATUS & REVIEW NOTES
// ==========================================
router.patch(
  '/:id/status',
  authenticateSession,
  requireRole(['super_admin', 'charity_admin', 'admin', 'genaral', 'user']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const reviewer = (req as any).user?.name || (req as any).user?.email || 'Admin';
      const now = new Date();

      const updateData: any = {
        updatedAt: now,
      };
      if (status) updateData.status = status;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      updateData.reviewedBy = reviewer;
      updateData.reviewedAt = now;

      try {
        await db
          .update(scholarshipApplication)
          .set(updateData)
          .where(eq(scholarshipApplication.id, id));

        const updated = await db
          .select()
          .from(scholarshipApplication)
          .where(eq(scholarshipApplication.id, id))
          .limit(1);

        if (updated.length > 0) return res.json(updated[0]);
      } catch (dbErr: any) {
        console.warn('⚠️ [APPLICATIONS] DB update error, updating fallback store:', dbErr.message);
        const fallbackApps = readFallbackApplications();
        const index = fallbackApps.findIndex(a => a.id === id);
        if (index !== -1) {
          fallbackApps[index] = { ...fallbackApps[index], ...updateData };
          writeFallbackApplications(fallbackApps);
          return res.json(fallbackApps[index]);
        }
      }

      res.json({ success: true, message: 'Status updated' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update application status: ' + err.message });
    }
  }
);

// ==========================================
// 5. ADMIN: DELETE APPLICATION
// ==========================================
router.delete(
  '/:id',
  authenticateSession,
  requireRole(['super_admin', 'charity_admin', 'admin', 'genaral']),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      try {
        await db.delete(scholarshipApplication).where(eq(scholarshipApplication.id, id));
      } catch (_) {
        const fallbackApps = readFallbackApplications();
        const filtered = fallbackApps.filter(a => a.id !== id);
        writeFallbackApplications(filtered);
      }

      res.json({ success: true, message: 'Application deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete application: ' + err.message });
    }
  }
);

export default router;
