import { api } from '../api';
import type { CharityCampaign, CharityProject, CharityVolunteer, CharityDonation } from '@/types/charity';

/**
 * Charity API Service Helpers
 * Reuses the core fetch wrapper (cross-domain auth, token cache, and refresh)
 */

export async function fetchCharityOverview() {
  const res = await api('/api/charity');
  return res.json();
}

export async function fetchPublicCampaigns(): Promise<CharityCampaign[]> {
  const res = await api('/api/charity/campaigns');
  return res.json();
}

export async function fetchPublicProjects(): Promise<CharityProject[]> {
  const res = await api('/api/charity/projects');
  return res.json();
}

export async function registerVolunteer(data: Partial<CharityVolunteer>) {
  const res = await api('/api/charity/volunteers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchAdminDonations(): Promise<CharityDonation[]> {
  const res = await api('/api/charity/donations');
  return res.json();
}
