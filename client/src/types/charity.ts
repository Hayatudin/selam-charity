/**
 * CHARITY DOMAIN TYPES
 * 
 * Defines core contracts for campaigns, donations, projects, volunteers, and impact metrics.
 */

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ProjectStatus = 'planning' | 'active' | 'completed';
export type VolunteerStatus = 'pending' | 'approved' | 'active' | 'inactive';
export type PaymentMethod = 'telebirr' | 'chapa' | 'cbe_birr' | 'bank_transfer' | 'stripe' | 'manual';

export interface CharityCampaign {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: 'Emergency Relief' | 'Education' | 'Healthcare' | 'Clean Water' | 'Food Security' | 'General';
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  featuredImageUrl?: string;
  galleryImages?: string[];
  startDate?: string;
  endDate?: string;
  isFeatured: boolean;
  status: CampaignStatus;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharityDonation {
  id: string;
  campaignId?: string;
  campaign?: CharityCampaign;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  isAnonymous: boolean;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  receiptUrl?: string;
  notes?: string;
  status: DonationStatus;
  userId?: string;
  createdAt: string;
}

export interface CharityProject {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  location?: string;
  coverImageUrl?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CharityVolunteer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  skills?: string[];
  interests?: string;
  availability: 'weekends' | 'full-time' | 'part-time' | 'remote';
  status: VolunteerStatus;
  userId?: string;
  createdAt: string;
}

export interface CharityImpactSummary {
  totalDonationsAmount: number;
  totalDonorsCount: number;
  activeCampaignsCount: number;
  beneficiariesReached: number;
  projectsCompleted: number;
}
