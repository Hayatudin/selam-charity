import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { charityDonation } from '../../db/schema';
import { eq, desc, and, or, like, sql } from 'drizzle-orm';
import { authenticateSession, requireRole } from '../../middlewares/auth';
import { getSession } from '../../lib/auth-helper';
import { uploadToLocal } from '../../lib/upload';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createId } from '@paralleldrive/cuid2';

const router = Router();

import os from 'os';

// Configure multer temp upload directory using OS temp directory (always writable on Linux/cPanel)
const tempUploadDir = os.tmpdir();

const upload = multer({
  dest: tempUploadDir,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB receipt limit
});

// JSON fallback file for local development if MySQL connection is offline
const fallbackStorePath = path.join(process.cwd(), 'public', 'uploads', 'charity', 'donations_store.json');
function ensureFallbackDir() {
  const dir = path.dirname(fallbackStorePath);
  if (!fs.existsSync(dir)) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch (_) {}
  }
}

function readFallbackDonations(): any[] {
  try {
    ensureFallbackDir();
    if (fs.existsSync(fallbackStorePath)) {
      const data = fs.readFileSync(fallbackStorePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (_) {}
  return [];
}

function writeFallbackDonations(donations: any[]) {
  try {
    ensureFallbackDir();
    fs.writeFileSync(fallbackStorePath, JSON.stringify(donations, null, 2), 'utf8');
  } catch (err) {
    console.error('[DONATIONS] Failed to write fallback store:', err);
  }
}

// Self-healing table check on startup
let tableChecked = false;
async function ensureDonationsTable() {
  if (tableChecked) return;
  try {
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS CharityDonation (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        campaignId VARCHAR(191) NULL,
        donorName VARCHAR(191) NOT NULL,
        donorEmail VARCHAR(191) NOT NULL,
        donorPhone VARCHAR(191) NULL,
        isAnonymous TINYINT(1) NOT NULL DEFAULT 0,
        amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'ETB',
        paymentMethod VARCHAR(100) NOT NULL DEFAULT 'Commercial Bank of Ethiopia',
        bankName VARCHAR(100) NULL,
        accountNumber VARCHAR(100) NULL,
        transactionReference VARCHAR(191) NULL,
        receiptUrl TEXT NULL,
        notes TEXT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        verifiedAt DATETIME(3) NULL,
        verifiedBy VARCHAR(191) NULL,
        userId VARCHAR(191) NULL,
        createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        INDEX CharityDonation_status_idx (status),
        INDEX CharityDonation_createdAt_idx (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `));
    tableChecked = true;
    console.log('✅ [DONATIONS] CharityDonation database table verified.');
  } catch (err: any) {
    // If local MySQL connection is offline, log and fallback to local file store
    console.warn('⚠️ [DONATIONS] Database query failed, using local file store fallback:', err.message);
  }
}

// Execute check asynchronously
ensureDonationsTable().catch(() => {});

// ==========================================
// 1. PUBLIC: SUBMIT DONATION RECEIPT
// ==========================================
router.post('/', upload.single('receiptFile'), async (req: Request, res: Response) => {
  try {
    await ensureDonationsTable();

    const {
      donorName,
      donorEmail,
      donorPhone,
      bankName,
      accountNumber,
      amount,
      currency = 'ETB',
      transactionReference,
      notes,
      isAnonymous = false,
      receiptUrl: providedReceiptUrl,
    } = req.body;

    if (!donorName || !donorPhone || !amount) {
      return res.status(400).json({ error: 'Donor name, phone number, and amount are required.' });
    }

    let finalReceiptUrl = providedReceiptUrl || null;

    // Handle uploaded file if present
    if (req.file) {
      const targetDir = path.join(process.cwd(), 'public', 'uploads', 'charity', 'receipts');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const ext = path.extname(req.file.originalname) || '.jpg';
      const cleanFileName = `receipt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const destPath = path.join(targetDir, cleanFileName);

      fs.copyFileSync(req.file.path, destPath);
      try { fs.unlinkSync(req.file.path); } catch (_) {}

      finalReceiptUrl = `/uploads/charity/receipts/${cleanFileName}`;
    }

    const newDonationId = createId();
    const parsedAmount = parseFloat(amount) || 0;

    const effectiveTxRef = transactionReference || req.body.transactionRef || null;

    const record = {
      id: newDonationId,
      campaignId: null,
      donorName: String(donorName).trim(),
      donorEmail: donorEmail ? String(donorEmail).trim() : null,
      donorPhone: String(donorPhone).trim(),
      isAnonymous: Boolean(isAnonymous),
      amount: parsedAmount.toFixed(2),
      currency: String(currency).toUpperCase(),
      paymentMethod: bankName || 'Bank Transfer',
      bankName: bankName || 'Commercial Bank of Ethiopia',
      accountNumber: accountNumber || null,
      transactionReference: effectiveTxRef ? String(effectiveTxRef).trim() : null,
      receiptUrl: finalReceiptUrl,
      notes: notes ? String(notes).trim() : null,
      status: 'pending',
      verifiedAt: null,
      verifiedBy: null,
      userId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try DB insertion first
    try {
      await db.insert(charityDonation).values({
        id: record.id,
        campaignId: record.campaignId,
        donorName: record.donorName,
        donorEmail: record.donorEmail,
        donorPhone: record.donorPhone,
        isAnonymous: record.isAnonymous,
        amount: record.amount as any,
        currency: record.currency,
        paymentMethod: record.paymentMethod,
        bankName: record.bankName,
        accountNumber: record.accountNumber,
        transactionReference: record.transactionReference,
        receiptUrl: record.receiptUrl,
        notes: record.notes,
        status: record.status,
      });

      console.log(`[DONATIONS] New receipt submitted to DB: ${record.id} by ${record.donorName}`);
      return res.status(201).json({ success: true, donation: record });
    } catch (dbErr: any) {
      console.warn('[DONATIONS] DB insert error, writing to fallback store:', dbErr.message);
      const list = readFallbackDonations();
      list.unshift(record);
      writeFallbackDonations(list);
      return res.status(201).json({ success: true, donation: record, storage: 'fallback' });
    }
  } catch (err: any) {
    console.error('[DONATIONS] Public submission error:', err);
    res.status(500).json({ error: 'Failed to submit donation receipt', details: err.message });
  }
});

// ==========================================
// 2. ADMIN: GET DONATION STATS (Protected)
// ==========================================
router.get('/stats', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    await ensureDonationsTable();

    try {
      const all = await db.select().from(charityDonation);
      const totalAmountETB = all
        .filter(d => (d.currency || 'ETB').toUpperCase() === 'ETB' && d.status === 'verified')
        .reduce((sum, d) => sum + (parseFloat(String(d.amount)) || 0), 0);
      const totalAmountUSD = all
        .filter(d => (d.currency || '').toUpperCase() === 'USD' && d.status === 'verified')
        .reduce((sum, d) => sum + (parseFloat(String(d.amount)) || 0), 0);
      const pendingCount = all.filter(d => d.status === 'pending').length;
      const verifiedCount = all.filter(d => d.status === 'verified').length;
      const rejectedCount = all.filter(d => d.status === 'rejected').length;

      return res.json({
        totalDonations: all.length,
        totalAmountETB,
        totalAmountUSD,
        pendingCount,
        verifiedCount,
        rejectedCount,
      });
    } catch (_) {
      const all = readFallbackDonations();
      const totalAmountETB = all
        .filter(d => (d.currency || 'ETB').toUpperCase() === 'ETB' && d.status === 'verified')
        .reduce((sum, d) => sum + (parseFloat(String(d.amount)) || 0), 0);
      const totalAmountUSD = all
        .filter(d => (d.currency || '').toUpperCase() === 'USD' && d.status === 'verified')
        .reduce((sum, d) => sum + (parseFloat(String(d.amount)) || 0), 0);
      const pendingCount = all.filter(d => d.status === 'pending').length;
      const verifiedCount = all.filter(d => d.status === 'verified').length;
      const rejectedCount = all.filter(d => d.status === 'rejected').length;

      return res.json({
        totalDonations: all.length,
        totalAmountETB,
        totalAmountUSD,
        pendingCount,
        verifiedCount,
        rejectedCount,
      });
    }
  } catch (err: any) {
    console.error('[DONATIONS] Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch donation statistics', details: err.message });
  }
});

// ==========================================
// 3. ADMIN: LIST ALL DONATIONS (Protected)
// ==========================================
router.get('/', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    await ensureDonationsTable();
    const { status, bank, search } = req.query;

    try {
      let query = db.select().from(charityDonation).orderBy(desc(charityDonation.createdAt));
      const conditions = [];

      if (status && typeof status === 'string' && status !== 'all') {
        conditions.push(eq(charityDonation.status, status));
      }
      if (bank && typeof bank === 'string' && bank !== 'all') {
        conditions.push(eq(charityDonation.bankName, bank));
      }
      if (search && typeof search === 'string' && search.trim()) {
        const term = `%${search.trim()}%`;
        conditions.push(
          or(
            like(charityDonation.donorName, term),
            like(charityDonation.donorEmail, term),
            like(charityDonation.transactionReference, term)
          )
        );
      }

      if (conditions.length > 0) {
        // @ts-ignore
        query.where(and(...conditions));
      }

      const items = await query;
      return res.json(items);
    } catch (_) {
      // Fallback store
      let list = readFallbackDonations();
      if (status && status !== 'all') {
        list = list.filter(d => d.status === status);
      }
      if (bank && bank !== 'all') {
        list = list.filter(d => d.bankName === bank);
      }
      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        list = list.filter(d =>
          (d.donorName || '').toLowerCase().includes(q) ||
          (d.donorEmail || '').toLowerCase().includes(q) ||
          (d.transactionReference || '').toLowerCase().includes(q)
        );
      }
      return res.json(list);
    }
  } catch (err: any) {
    console.error('[DONATIONS] List error:', err);
    res.status(500).json({ error: 'Failed to fetch donations', details: err.message });
  }
});

// ==========================================
// 4. ADMIN: UPDATE STATUS (VERIFY / REJECT)
// ==========================================
router.put('/:id/status', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const session = await getSession(req);

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be pending, verified, or rejected.' });
    }

    const verifiedAt = status === 'verified' ? new Date() : null;
    const verifiedBy = session?.user?.name || session?.user?.email || 'Admin';

    try {
      await db.update(charityDonation)
        .set({
          status,
          notes: notes !== undefined ? notes : undefined,
          verifiedAt,
          verifiedBy: status === 'verified' ? verifiedBy : null,
          updatedAt: new Date()
        })
        .where(eq(charityDonation.id, id));

      const updated = await db.query.charityDonation.findFirst({
        where: eq(charityDonation.id, id),
      });

      return res.json({ success: true, donation: updated });
    } catch (_) {
      const list = readFallbackDonations();
      const item = list.find(d => d.id === id);
      if (item) {
        item.status = status;
        if (notes !== undefined) item.notes = notes;
        item.verifiedAt = verifiedAt ? verifiedAt.toISOString() : null;
        item.verifiedBy = status === 'verified' ? verifiedBy : null;
        item.updatedAt = new Date().toISOString();
        writeFallbackDonations(list);
        return res.json({ success: true, donation: item });
      }
      return res.status(404).json({ error: 'Donation record not found' });
    }
  } catch (err: any) {
    console.error('[DONATIONS] Update status error:', err);
    res.status(500).json({ error: 'Failed to update donation status', details: err.message });
  }
});

// ==========================================
// 5. ADMIN: RECORD MANUAL DONATION
// ==========================================
router.post('/manual', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const session = await getSession(req);
    const {
      donorName,
      donorEmail,
      donorPhone,
      bankName = 'Cash / Direct Deposit',
      accountNumber,
      amount,
      currency = 'ETB',
      transactionReference,
      notes,
      status = 'verified',
    } = req.body;

    if (!donorName || !amount) {
      return res.status(400).json({ error: 'Donor name and amount are required' });
    }

    const newId = createId();
    const record = {
      id: newId,
      campaignId: null,
      donorName: String(donorName).trim(),
      donorEmail: donorEmail ? String(donorEmail).trim() : 'offline-donor@selam.org',
      donorPhone: donorPhone ? String(donorPhone).trim() : null,
      isAnonymous: false,
      amount: parseFloat(amount).toFixed(2),
      currency: String(currency).toUpperCase(),
      paymentMethod: bankName,
      bankName,
      accountNumber: accountNumber || null,
      transactionReference: transactionReference || `MANUAL-${Date.now().toString().slice(-6)}`,
      receiptUrl: null,
      notes: notes || 'Direct offline / cash donation recorded by staff',
      status: status,
      verifiedAt: status === 'verified' ? new Date().toISOString() : null,
      verifiedBy: session?.user?.name || 'Staff',
      userId: session?.user?.id || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await db.insert(charityDonation).values({
        id: record.id,
        campaignId: record.campaignId,
        donorName: record.donorName,
        donorEmail: record.donorEmail,
        donorPhone: record.donorPhone,
        isAnonymous: record.isAnonymous,
        amount: record.amount as any,
        currency: record.currency,
        paymentMethod: record.paymentMethod,
        bankName: record.bankName,
        accountNumber: record.accountNumber,
        transactionReference: record.transactionReference,
        receiptUrl: record.receiptUrl,
        notes: record.notes,
        status: record.status,
        verifiedAt: record.verifiedAt ? new Date(record.verifiedAt) : null,
        verifiedBy: record.verifiedBy,
      });

      return res.status(201).json({ success: true, donation: record });
    } catch (_) {
      const list = readFallbackDonations();
      list.unshift(record);
      writeFallbackDonations(list);
      return res.status(201).json({ success: true, donation: record });
    }
  } catch (err: any) {
    console.error('[DONATIONS] Manual entry error:', err);
    res.status(500).json({ error: 'Failed to record manual donation', details: err.message });
  }
});

// ==========================================
// 6. ADMIN: DELETE DONATION
// ==========================================
router.delete('/:id', authenticateSession, requireRole(['super_admin', 'charity_admin', 'genaral', 'user']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      await db.delete(charityDonation).where(eq(charityDonation.id, id));
      return res.json({ success: true, message: 'Donation record deleted' });
    } catch (_) {
      let list = readFallbackDonations();
      list = list.filter(d => d.id !== id);
      writeFallbackDonations(list);
      return res.json({ success: true, message: 'Donation record deleted' });
    }
  } catch (err: any) {
    console.error('[DONATIONS] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete donation', details: err.message });
  }
});

export default router;
