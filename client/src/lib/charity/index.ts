import { api } from '../api';
import type { 
  CharityDashboardStats,
  CharityNewsItem,
  CharityGalleryItem,
  CharityMediaItem,
  SchoolAllSections,
  SchoolSectionData,
  PagesAllContent,
  PageContentData,
  CharityDonationItem,
  CharityDonationStats,
  SubmitDonationReceiptInput,
} from '@/types/charity';

/**
 * Central Charity CMS API Client Layer
 * Reuses the core fetch wrapper (session cookies, Bearer token fallback, auto-refresh)
 */

// ── 1. DASHBOARD ───────────────────────────────────────────────
export async function getCharityDashboardStats(): Promise<CharityDashboardStats> {
  try {
    const res = await api('/api/charity/dashboard/stats');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (_) {}

  // Fallback defaults so the dashboard always renders cleanly
  return {
    stats: {
      donations: { total: 0, pending: 0, totalAmountETB: 0, totalAmountUSD: 0 },
      news: { total: 0, published: 0 },
      gallery: { total: 0, images: 0, videos: 0 },
      media: { total: 0, images: 0, videos: 0, documents: 0 },
    },
    recentDonations: [],
    recentNews: [],
    recentUploads: [],
  };
}

// ── 2. NEWS ────────────────────────────────────────────────────
export async function getCharityNews(params?: { status?: string; category?: string; search?: string }): Promise<CharityNewsItem[]> {
  try {
    const sp = new URLSearchParams();
    if (params?.status && params.status !== 'all') sp.set('status', params.status);
    if (params?.category && params.category !== 'all') sp.set('category', params.category);
    if (params?.search) sp.set('search', params.search);

    const query = sp.toString() ? `?${sp.toString()}` : '';
    const res = await api(`/api/charity/news${query}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (_) {}
  return [];
}

export async function getCharityNewsById(idOrSlug: string): Promise<CharityNewsItem> {
  const res = await api(`/api/charity/news/${idOrSlug}`);
  return res.json();
}

export async function createCharityNews(data: Partial<CharityNewsItem>): Promise<CharityNewsItem> {
  const res = await api('/api/charity/news', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCharityNews(id: string, data: Partial<CharityNewsItem>): Promise<CharityNewsItem> {
  const res = await api(`/api/charity/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function togglePublishNews(id: string): Promise<{ id: string; status: string; publishedAt: string | null }> {
  const res = await api(`/api/charity/news/${id}/toggle-publish`, {
    method: 'PATCH',
  });
  return res.json();
}

export async function deleteCharityNews(id: string): Promise<{ success: boolean }> {
  const res = await api(`/api/charity/news/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// ── 3. GALLERY ─────────────────────────────────────────────────
export async function getCharityGallery(params?: { category?: string; mediaType?: string }): Promise<CharityGalleryItem[]> {
  const sp = new URLSearchParams();
  if (params?.category && params.category !== 'all') sp.set('category', params.category);
  if (params?.mediaType && params.mediaType !== 'all') sp.set('mediaType', params.mediaType);

  const query = sp.toString() ? `?${sp.toString()}` : '';
  const res = await api(`/api/charity/gallery${query}`);
  return res.json();
}

export async function createCharityGalleryItem(data: Partial<CharityGalleryItem>): Promise<CharityGalleryItem> {
  const res = await api('/api/charity/gallery', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function batchCreateCharityGalleryItems(items: Partial<CharityGalleryItem>[]): Promise<{ success: boolean; count: number; items: CharityGalleryItem[] }> {
  const res = await api('/api/charity/gallery/batch', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
  return res.json();
}

export async function updateCharityGalleryItem(id: string, data: Partial<CharityGalleryItem>): Promise<CharityGalleryItem> {
  const res = await api(`/api/charity/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCharityGalleryItem(id: string): Promise<{ success: boolean }> {
  const res = await api(`/api/charity/gallery/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// ── 4. MEDIA / FILE LIBRARY ────────────────────────────────────
export async function getCharityMedia(params?: { fileType?: string; search?: string }): Promise<CharityMediaItem[]> {
  const sp = new URLSearchParams();
  if (params?.fileType && params.fileType !== 'all') sp.set('fileType', params.fileType);
  if (params?.search) sp.set('search', params.search);

  const query = sp.toString() ? `?${sp.toString()}` : '';
  const res = await api(`/api/charity/media${query}`);
  return res.json();
}

export async function uploadMediaBase64(data: { fileString: string; fileName: string; caption?: string; fileType?: string }): Promise<CharityMediaItem> {
  const res = await api('/api/charity/media/upload-base64', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function uploadMediaFile(formData: FormData): Promise<CharityMediaItem> {
  const res = await api('/api/charity/media/upload-file', {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function updateMediaMetadata(id: string, data: { name?: string; caption?: string }): Promise<CharityMediaItem> {
  const res = await api(`/api/charity/media/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCharityMedia(id: string): Promise<{ success: boolean }> {
  const res = await api(`/api/charity/media/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// ── 5. SCHOOL CONTENT ──────────────────────────────────────────
export async function getSchoolAllSections(): Promise<SchoolAllSections> {
  const res = await api('/api/charity/school');
  return res.json();
}

export async function updateSchoolSection(sectionKey: string, data: Partial<SchoolSectionData>): Promise<SchoolSectionData> {
  const res = await api(`/api/charity/school/${sectionKey}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

// ── 6. PAGES CMS ───────────────────────────────────────────────
export async function getPagesAllContent(): Promise<PagesAllContent> {
  const res = await api('/api/charity/pages');
  return res.json();
}

export async function updatePageContent(pageKey: string, data: Partial<PageContentData>): Promise<PageContentData> {
  const res = await api(`/api/charity/pages/${pageKey}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

// ── 7. CONTACT INQUIRY ─────────────────────────────────────────
export async function sendContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  category?: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await api('/api/charity/pages/contact-message', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

// ── 8. DONATIONS & RECEIPTS ────────────────────────────────────
export async function getCharityDonations(params?: {
  status?: string;
  bank?: string;
  search?: string;
}): Promise<CharityDonationItem[]> {
  try {
    const sp = new URLSearchParams();
    if (params?.status && params.status !== 'all') sp.set('status', params.status);
    if (params?.bank && params.bank !== 'all') sp.set('bank', params.bank);
    if (params?.search) sp.set('search', params.search);

    const query = sp.toString() ? `?${sp.toString()}` : '';
    const res = await api(`/api/charity/donations${query}`);
    if (res.ok) return await res.json();
  } catch (_) {}
  return [];
}

export async function getCharityDonationStats(): Promise<CharityDonationStats> {
  try {
    const res = await api('/api/charity/donations/stats');
    if (res.ok) return await res.json();
  } catch (_) {}
  return {
    totalDonations: 0,
    totalAmountETB: 0,
    totalAmountUSD: 0,
    pendingCount: 0,
    verifiedCount: 0,
    rejectedCount: 0,
  };
}

export async function submitDonationReceipt(data: SubmitDonationReceiptInput): Promise<{ success: boolean; donation: CharityDonationItem }> {
  // If a File is provided, use FormData (multipart)
  if (data.receiptFile) {
    const formData = new FormData();
    formData.append('donorName', data.donorName);
    formData.append('donorPhone', data.donorPhone);
    if (data.donorEmail) formData.append('donorEmail', data.donorEmail);
    formData.append('bankName', data.bankName);
    if (data.accountNumber) formData.append('accountNumber', data.accountNumber);
    formData.append('amount', String(data.amount));
    if (data.currency) formData.append('currency', data.currency);
    if (data.transactionReference) formData.append('transactionReference', data.transactionReference);
    if (data.notes) formData.append('notes', data.notes);
    formData.append('receiptFile', data.receiptFile);

    const res = await api('/api/charity/donations', {
      method: 'POST',
      body: formData,
    });
    return res.json();
  }

  // Otherwise send JSON
  const res = await api('/api/charity/donations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateDonationStatus(
  id: string,
  status: 'pending' | 'verified' | 'rejected',
  notes?: string
): Promise<{ success: boolean; donation: CharityDonationItem }> {
  const res = await api(`/api/charity/donations/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  });
  return res.json();
}

export async function recordManualDonation(data: any): Promise<{ success: boolean; donation: CharityDonationItem }> {
  const res = await api('/api/charity/donations/manual', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCharityDonation(id: string): Promise<{ success: boolean; message: string }> {
  const res = await api(`/api/charity/donations/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

