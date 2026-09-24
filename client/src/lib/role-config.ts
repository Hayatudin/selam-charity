// ── Centralized Role-Based Access Control Configuration ───────────────────────
// Single source of truth for all role definitions and route access in the system.

// All valid roles in the system (Agency + Core + Charity)
export type Role = 
  | 'user' 
  | 'agency' 
  | 'super_admin' 
  | 'registrar' 
  | 'processor' 
  | 'coordinator' 
  | 'accountant' 
  | 'video_uploader' 
  | 'genaral' 
  | 'calling'
  | 'charity_admin'
  | 'donor'
  | 'volunteer';

// Roles that can access the internal dashboard (agency is treated like user for now)
export const DASHBOARD_ROLES: Role[] = [
  'super_admin',
  'registrar',
  'processor',
  'coordinator',
  'accountant',
  'video_uploader',
  'agency',
  'genaral',
  'calling',
  'charity_admin',
  'user',
];

import { getUserMajorAgency } from '@/lib/cv-templates';

// Helper: check if a user can access the Calling option based on agency rules
export function canAccessCalling(user: any): boolean {
  if (!user) return false;
  const major = getUserMajorAgency(user);
  const isFenero = major.toLowerCase().includes('fenero');
  if (isFenero) return true; // All Fenero users can access

  // For SKY major_agency: Only kadra@gmail.com, super_admin, and calling role
  const email = (user.email || '').toLowerCase().trim();
  const role = user.role;
  return email === 'kadra@gmail.com' || role === 'super_admin' || role === 'calling';
}

// Route → which roles can see/access it
export const ROUTE_ACCESS: Record<string, Role[]> = {
  '/dashboard': ['super_admin', 'charity_admin', 'user'],
  '/charity/dashboard': ['super_admin', 'charity_admin', 'user'],
  '/charity/donations': ['super_admin', 'charity_admin', 'user'],
  '/charity/news': ['super_admin', 'charity_admin', 'user'],
  '/charity/gallery': ['super_admin', 'charity_admin', 'user'],
  '/charity/media': ['super_admin', 'charity_admin', 'user'],
  '/charity/school': ['super_admin', 'charity_admin', 'user'],
  '/charity/pages': ['super_admin', 'charity_admin', 'user'],
  '/settings': ['super_admin', 'charity_admin', 'user'],
  '/users': ['super_admin'],
};

// Helper: check if a role can access a specific route
export function canAccess(role: string, route: string): boolean {
  // Super admin can access everything
  if (role === 'super_admin') return true;

  // Find the matching route (exact or prefix match)
  const exactMatch = ROUTE_ACCESS[route];
  if (exactMatch) return exactMatch.includes(role as Role);

  // Prefix match for nested routes like /candidates/[id]
  for (const [path, roles] of Object.entries(ROUTE_ACCESS)) {
    if (route.startsWith(path)) {
      return roles.includes(role as Role);
    }
  }

  return false;
}

// Role display configuration for UI
export const ROLE_CONFIG: Record<Role, { label: string; color: string; badgeBg: string; badgeText: string; badgeBorder: string }> = {
  super_admin: { label: 'Super Admin', color: 'amber', badgeBg: 'bg-amber-100', badgeText: 'text-amber-700', badgeBorder: 'border-amber-200' },
  video_uploader: { label: 'Video Uploader', color: 'rose', badgeBg: 'bg-rose-100', badgeText: 'text-rose-700', badgeBorder: 'border-rose-200' },
  genaral: { label: 'General', color: 'indigo', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-700', badgeBorder: 'border-indigo-200' },
  registrar: { label: 'Registrar', color: 'emerald', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700', badgeBorder: 'border-emerald-200' },
  processor: { label: 'Processor', color: 'blue', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700', badgeBorder: 'border-blue-200' },
  coordinator: { label: 'Coordinator', color: 'violet', badgeBg: 'bg-violet-100', badgeText: 'text-violet-700', badgeBorder: 'border-violet-200' },
  accountant: { label: 'Accountant', color: 'orange', badgeBg: 'bg-orange-100', badgeText: 'text-orange-700', badgeBorder: 'border-orange-200' },
  agency: { label: 'Agency', color: 'cyan', badgeBg: 'bg-cyan-100', badgeText: 'text-cyan-700', badgeBorder: 'border-cyan-200' },
  user: { label: 'User', color: 'gray', badgeBg: 'bg-gray-100', badgeText: 'text-gray-500', badgeBorder: 'border-gray-200' },
  calling: { label: 'Calling', color: 'teal', badgeBg: 'bg-teal-100', badgeText: 'text-teal-700', badgeBorder: 'border-teal-200' },
  charity_admin: { label: 'Charity Admin', color: 'emerald', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700', badgeBorder: 'border-emerald-200' },
  donor: { label: 'Donor', color: 'pink', badgeBg: 'bg-pink-100', badgeText: 'text-pink-700', badgeBorder: 'border-pink-200' },
  volunteer: { label: 'Volunteer', color: 'lime', badgeBg: 'bg-lime-100', badgeText: 'text-lime-700', badgeBorder: 'border-lime-200' },
};

// Sidebar badge colors (dark theme for sidebar)
export const SIDEBAR_BADGE_COLORS: Record<string, string> = {
  super_admin: 'bg-amber-400/20 text-amber-300',
  registrar: 'bg-emerald-400/20 text-emerald-300',
  processor: 'bg-blue-400/20 text-blue-300',
  coordinator: 'bg-violet-400/20 text-violet-300',
  accountant: 'bg-orange-400/20 text-orange-300',
  agency: 'bg-cyan-400/20 text-cyan-300',
  video_uploader: 'bg-rose-400/20 text-rose-300',
  genaral: 'bg-indigo-400/20 text-indigo-300',
  user: 'bg-white/10 text-white/40',
  calling: 'bg-teal-400/20 text-teal-300',
  charity_admin: 'bg-emerald-400/20 text-emerald-300',
  donor: 'bg-pink-400/20 text-pink-300',
  volunteer: 'bg-lime-400/20 text-lime-300',
};
