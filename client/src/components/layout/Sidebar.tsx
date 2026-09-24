'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession, signOut } from '@/lib/auth-client';
import { ROLE_CONFIG, type Role } from '@/lib/role-config';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ShieldCheck,
  Loader2,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Newspaper,
  Images,
  FolderArchive,
  GraduationCap,
  Globe,
  Landmark,
  ExternalLink,
} from 'lucide-react';

const charityNavItems = [
  { label: 'Charity Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Donations & Receipts', href: '/charity/donations', icon: Landmark },
  { label: 'News & Updates', href: '/charity/news', icon: Newspaper },
  { label: 'Gallery', href: '/charity/gallery', icon: Images },
  { label: 'Media Library', href: '/charity/media', icon: FolderArchive },
  { label: 'School CMS', href: '/charity/school', icon: GraduationCap },
  { label: 'Pages & Info', href: '/charity/pages', icon: Globe },
];

const adminNavItems = [
  { label: 'Users & Roles', href: '/users', icon: ShieldCheck },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
  isMobile?: boolean;
  onNavigate?: () => void;
}

function AgencyMark({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-lg bg-emerald-600 overflow-hidden p-1">
        <img src="/Selam-logo.jpg" alt="Selam" className="w-full h-full object-contain rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-lg bg-emerald-600 overflow-hidden p-0.5">
        <img src="/Selam-logo.jpg" alt="Selam" className="w-full h-full object-contain rounded" />
      </div>
      <div className="min-w-0">
        <p className="text-white font-bold text-[15px] leading-tight truncate">SELAM Charity</p>
        <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">Management System</p>
      </div>
    </div>
  );
}

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobile, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const role = ((session?.user as any)?.role ?? 'user') as string;
  const isSuperAdmin = role === 'super_admin';

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const handleNavClick = () => {
    if (onNavigate) onNavigate();
  };

  const roleConfig = ROLE_CONFIG[role as Role];
  const roleLabel = roleConfig?.label || role.replace('_', ' ');
  const showLabels = isMobile || !isCollapsed;

  return (
    <aside
      className={cn(
        'relative shrink-0 h-full lg:h-screen flex flex-col z-40 transition-all duration-300 overflow-hidden',
        'bg-[#1e293b] border-r border-slate-700/60',
        isMobile ? 'w-72' : isCollapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-700/60 shrink-0">
        <Link
          href="/dashboard"
          onClick={handleNavClick}
          className="flex items-center gap-3 min-w-0 overflow-hidden hover:opacity-95 transition-opacity"
        >
          <AgencyMark compact={!showLabels} />
        </Link>

        {isMobile ? (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        ) : showLabels ? (
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        ) : (
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
      </div>

      {/* Current Charity Quick Launcher */}
      <div className="px-2 pt-3 pb-1 shrink-0">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          prefetch={true}
          className={cn(
            'flex items-center rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition-all duration-200 group',
            showLabels ? 'gap-2.5 px-3 py-2 mx-1' : 'justify-center p-2 mx-1'
          )}
          title="Current Charity - View Live Website"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
            <Globe size={18} className="text-emerald-400" />
          </div>
          {showLabels && (
            <div className="flex items-center justify-between w-full min-w-0">
              <span className="text-[12px] font-bold truncate">Current Charity</span>
              <ExternalLink size={12} className="text-emerald-400/70 group-hover:text-emerald-300 shrink-0 ml-1" />
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden sidebar-scroll">
        {/* Primary Charity CMS Navigation */}
        <div className="pb-2">
          {showLabels && (
            <div className="px-3 py-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Charity Portals</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Active</span>
            </div>
          )}
          {charityNavItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard' || pathname === '/charity/dashboard'
                : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onMouseEnter={() => router.prefetch(item.href)}
                onClick={handleNavClick}
                title={!showLabels ? item.label : undefined}
                className={cn(
                  'flex items-center rounded-lg transition-all duration-200 group relative',
                  showLabels ? 'gap-3 px-3 py-2.5 mx-1 mb-0.5' : 'justify-center py-2.5 mx-1 mb-0.5',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-semibold'
                    : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                )}
              >
                <Icon size={18} className={cn("shrink-0", isActive ? "text-white" : "text-emerald-400 group-hover:text-emerald-300")} />
                {showLabels && (
                  <span className="text-[13px] font-medium whitespace-nowrap truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* System Administration Navigation (Users & Settings) */}
        {isSuperAdmin && (
          <div className="pt-3 border-t border-slate-700/60">
            {showLabels ? (
              <div className="px-3 pb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Administration</span>
              </div>
            ) : (
              <div className="my-2 border-t border-slate-700/60" />
            )}
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onMouseEnter={() => router.prefetch(item.href)}
                  onClick={handleNavClick}
                  title={!showLabels ? item.label : undefined}
                  className={cn(
                    'flex items-center rounded-lg transition-all duration-200 group relative',
                    showLabels ? 'gap-3 px-3 py-2 mx-1' : 'justify-center py-2 mx-1',
                    isActive
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
                  )}
                >
                  <Icon size={16} className="shrink-0 text-slate-400 group-hover:text-slate-200" />
                  {showLabels && (
                    <span className="text-[12px] font-medium whitespace-nowrap truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* User + Logout */}
      <div className="shrink-0 border-t border-slate-700/60 p-2 space-y-1">
        {showLabels && session?.user && (
          <div className="px-3 py-2.5 mb-1 rounded-lg bg-slate-800/80 border border-slate-700/50">
            <p className="text-white text-sm font-semibold truncate">{session.user.name}</p>
            <p className="text-slate-400 text-[10px] truncate mt-0.5">{session.user.email}</p>
            <span className="inline-block mt-2 text-[9px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wide">
              {roleLabel}
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer',
            showLabels ? 'gap-3 px-3 py-2.5 mx-1' : 'justify-center py-2.5 mx-1'
          )}
          title={!showLabels ? 'Logout' : undefined}
        >
          {isPending ? (
            <Loader2 size={18} className="shrink-0 animate-spin" />
          ) : (
            <LogOut size={18} className="shrink-0" />
          )}
          {showLabels && <span className="text-[13px] font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
