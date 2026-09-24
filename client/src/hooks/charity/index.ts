import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCharityDashboardStats,
  getCharityNews,
  getCharityNewsById,
  createCharityNews,
  updateCharityNews,
  togglePublishNews,
  deleteCharityNews,
  getCharityGallery,
  createCharityGalleryItem,
  batchCreateCharityGalleryItems,
  updateCharityGalleryItem,
  deleteCharityGalleryItem,
  getCharityMedia,
  uploadMediaBase64,
  uploadMediaFile,
  updateMediaMetadata,
  deleteCharityMedia,
  getSchoolAllSections,
  updateSchoolSection,
  getPagesAllContent,
  updatePageContent,
  getCharityDonations,
  getCharityDonationStats,
  submitDonationReceipt,
  updateDonationStatus,
  recordManualDonation,
  deleteCharityDonation,
} from '@/lib/charity';
import type { 
  CharityNewsItem, 
  CharityGalleryItem, 
  SchoolSectionData, 
  PageContentData 
} from '@/types/charity';

// ── 1. DASHBOARD HOOK ───────────────────────────────────────────
export function useCharityDashboard() {
  return useQuery({
    queryKey: ['charity', 'dashboard'],
    queryFn: getCharityDashboardStats,
  });
}

// ── 2. NEWS HOOKS ───────────────────────────────────────────────
export function useCharityNewsList(params?: { status?: string; category?: string; search?: string }) {
  return useQuery({
    queryKey: ['charity', 'news', params],
    queryFn: () => getCharityNews(params),
  });
}

export function useCharityNewsItem(idOrSlug: string) {
  return useQuery({
    queryKey: ['charity', 'news', idOrSlug],
    queryFn: () => getCharityNewsById(idOrSlug),
    enabled: Boolean(idOrSlug),
  });
}

export function useCreateCharityNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CharityNewsItem>) => createCharityNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'news'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

export function useUpdateCharityNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CharityNewsItem> }) => updateCharityNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'news'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

export function useTogglePublishNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => togglePublishNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'news'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

export function useDeleteCharityNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCharityNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'news'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

// ── 3. GALLERY HOOKS ────────────────────────────────────────────
export function useCharityGalleryList(params?: { category?: string; mediaType?: string }) {
  return useQuery({
    queryKey: ['charity', 'gallery', params],
    queryFn: () => getCharityGallery(params),
  });
}

export const useCharityGallery = useCharityGalleryList;


export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CharityGalleryItem>) => createCharityGalleryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'gallery'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

export function useBatchCreateGalleryItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Partial<CharityGalleryItem>[]) => batchCreateCharityGalleryItems(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'gallery'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CharityGalleryItem> }) => updateCharityGalleryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'gallery'] });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCharityGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'gallery'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

// ── 4. MEDIA LIBRARY HOOKS ──────────────────────────────────────
export function useCharityMediaList(params?: { fileType?: string; search?: string }) {
  return useQuery({
    queryKey: ['charity', 'media', params],
    queryFn: () => getCharityMedia(params),
  });
}

export function useUploadMediaBase64() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { fileString: string; fileName: string; caption?: string; fileType?: string }) => uploadMediaBase64(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'media'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

export function useUploadMediaFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadMediaFile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'media'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

export function useUpdateMediaMetadata() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; caption?: string } }) => updateMediaMetadata(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'media'] });
    },
  });
}

export function useDeleteCharityMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCharityMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'media'] });
      queryClient.invalidateQueries({ queryKey: ['charity', 'dashboard'] });
    },
  });
}

// ── 5. SCHOOL CONTENT HOOKS ─────────────────────────────────────
export function useSchoolSections() {
  return useQuery({
    queryKey: ['charity', 'school'],
    queryFn: getSchoolAllSections,
  });
}

export function useUpdateSchoolSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionKey, data }: { sectionKey: string; data: Partial<SchoolSectionData> }) => updateSchoolSection(sectionKey, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'school'] });
    },
  });
}

// ── 6. PAGES CONTENT HOOKS ──────────────────────────────────────
export function usePagesContent() {
  return useQuery({
    queryKey: ['charity', 'pages'],
    queryFn: getPagesAllContent,
  });
}

export function useUpdatePageContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pageKey, data }: { pageKey: string; data: Partial<PageContentData> }) => updatePageContent(pageKey, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'pages'] });
    },
  });
}

// ── 7. CONTACT INQUIRY HOOK ────────────────────────────────────
export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      phone?: string;
      category?: string;
      subject?: string;
      message: string;
    }) => import('@/lib/charity').then(m => m.sendContactMessage(data)),
  });
}

// ── 8. DONATIONS & RECEIPTS HOOKS ──────────────────────────────
export function useCharityDonations(params?: { status?: string; bank?: string; search?: string }) {
  return useQuery({
    queryKey: ['charity', 'donations', params],
    queryFn: () => getCharityDonations(params),
  });
}

export function useCharityDonationStats() {
  return useQuery({
    queryKey: ['charity', 'donations', 'stats'],
    queryFn: () => getCharityDonationStats(),
  });
}

export function useSubmitDonationReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitDonationReceipt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'donations'] });
    },
  });
}

export function useUpdateDonationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: 'pending' | 'verified' | 'rejected'; notes?: string }) =>
      updateDonationStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'donations'] });
    },
  });
}

export function useRecordManualDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => recordManualDonation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'donations'] });
    },
  });
}

export function useDeleteDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCharityDonation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'donations'] });
    },
  });
}

