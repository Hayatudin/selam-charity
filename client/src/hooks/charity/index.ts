import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCharityOverview, 
  fetchPublicCampaigns, 
  fetchPublicProjects, 
  registerVolunteer,
  fetchAdminDonations 
} from '@/lib/charity';
import type { CharityVolunteer } from '@/types/charity';

export function useCharityOverview() {
  return useQuery({
    queryKey: ['charity', 'overview'],
    queryFn: fetchCharityOverview,
  });
}

export function useCharityCampaigns() {
  return useQuery({
    queryKey: ['charity', 'campaigns'],
    queryFn: fetchPublicCampaigns,
  });
}

export function useCharityProjects() {
  return useQuery({
    queryKey: ['charity', 'projects'],
    queryFn: fetchPublicProjects,
  });
}

export function useVolunteerRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CharityVolunteer>) => registerVolunteer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charity', 'volunteers'] });
    },
  });
}

export function useAdminDonations() {
  return useQuery({
    queryKey: ['charity', 'donations'],
    queryFn: fetchAdminDonations,
  });
}
