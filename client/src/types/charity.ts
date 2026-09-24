/**
 * CHARITY CMS TYPES
 */

// --- 1. MEDIA LIBRARY ---
export type CharityFileType = 'image' | 'video' | 'document';

export interface CharityMediaItem {
  id: string;
  name: string;
  originalName: string;
  url: string;
  fileType: CharityFileType;
  mimeType?: string | null;
  sizeBytes: number;
  caption?: string | null;
  uploadedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- 2. NEWS ---
export type NewsStatus = 'draft' | 'published';

export interface CharityNewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  category: string;
  featuredImageUrl?: string | null;
  status: NewsStatus;
  publishedAt?: string | null;
  authorId?: string | null;
  authorName?: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- 3. GALLERY ---
export type GalleryMediaType = 'image' | 'video';

export interface CharityGalleryItem {
  id: string;
  title: string;
  caption?: string | null;
  mediaType: GalleryMediaType;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  category: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

// --- 4. SCHOOL CONTENT ---
export type SchoolSectionKey = 'intro' | 'programs' | 'activities' | 'facilities';

export interface SchoolSectionData {
  id?: string;
  sectionKey: SchoolSectionKey;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  mediaUrls?: string[];
  metadata?: any;
  updatedAt?: string;
}

export type SchoolAllSections = Record<SchoolSectionKey, SchoolSectionData>;

// --- 5. PAGES CMS ---
export type PageContentKey = 'about' | 'mission' | 'contact' | 'general';

export interface PageContentData {
  id?: string;
  pageKey: PageContentKey;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  bannerImageUrl?: string | null;
  metadata?: any;
  updatedAt?: string;
}

export type PagesAllContent = Record<PageContentKey, PageContentData>;

// --- 6. DASHBOARD STATS ---
export interface CharityDashboardStats {
  stats: {
    donations?: { total: number; pending: number; totalAmountETB: number; totalAmountUSD: number };
    news: { total: number; published: number };
    gallery: { total: number; images: number; videos: number };
    media: { total: number; images: number; videos: number; documents: number };
  };
  recentDonations?: CharityDonationItem[];
  recentNews: CharityNewsItem[];
  recentUploads: CharityMediaItem[];
}

// --- 7. DONATIONS & RECEIPTS ---
export type DonationStatus = 'pending' | 'verified' | 'rejected';

export interface CharityDonationItem {
  id: string;
  campaignId?: string | null;
  donorName: string;
  donorEmail?: string | null;
  donorPhone?: string | null;
  isAnonymous?: boolean;
  amount: string | number;
  currency: string;
  paymentMethod: string;
  bankName: string;
  accountNumber?: string | null;
  transactionReference?: string | null;
  receiptUrl?: string | null;
  notes?: string | null;
  status: DonationStatus;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CharityDonationStats {
  totalDonations: number;
  totalAmountETB: number;
  totalAmountUSD: number;
  pendingCount: number;
  verifiedCount: number;
  rejectedCount: number;
}

export interface SubmitDonationReceiptInput {
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  bankName: string;
  accountNumber?: string;
  amount: number | string;
  currency?: string;
  transactionReference?: string;
  notes?: string;
  receiptFile?: File;
  receiptUrl?: string;
}
