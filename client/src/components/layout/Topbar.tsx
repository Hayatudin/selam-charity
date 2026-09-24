'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  FileText,
  X,
  Loader2,
  CheckCheck,
  Menu,
  RotateCw,
  LogOut,
  Globe,
  ExternalLink,
  Landmark,
  Newspaper,
  Images,
  GraduationCap
} from 'lucide-react';
import { cn, getFileUrl } from '@/lib/utils';
import { useSession, signOut } from '@/lib/auth-client';
import { api } from '@/lib/api';

interface TopbarProps {
  onMobileMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export default function Topbar({ onMobileMenuToggle, isSidebarCollapsed, onSidebarToggle }: TopbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api('/api/notifications');
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter((n: any) => !n.isRead).length);
        }
      } catch (err: any) {
        console.warn('Failed to fetch notifications', err.message || err);
      }
    };
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err: any) {
      console.warn('Failed to mark notifications as read', err.message || err);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await api(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setResults(data);
        setShowResults(true);
      } catch (err: any) {
        console.warn('Search error:', err.message || err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const role = (session?.user as any)?.role ?? 'user';

  return (
    <header className="sticky top-0 z-40 h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 md:px-6 gap-3">
      {/* Left: menu + brand + Current Charity Link */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} className="text-slate-600" />
        </button>

        {onSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={20} />
          </button>
        )}

        <Link href="/dashboard" className="hidden sm:flex items-center gap-2.5 pl-1 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-600 overflow-hidden p-0.5 shadow-sm">
            <img src="/Selam-logo.jpg" alt="Selam Charity" className="w-full h-full object-contain rounded" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-800">SELAM Charity</p>
            <p className="text-[10px] text-emerald-600 font-semibold hidden md:block">Management System</p>
          </div>
        </Link>

        {/* CURRENT CHARITY NAVBAR OPTION */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold transition-all shadow-xs hover:shadow group ml-1"
          title="Visit Live Charity Website"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Globe size={13} className="text-emerald-700 group-hover:scale-110 transition-transform" />
          <span className="font-bold">Current Charity</span>
          <ExternalLink size={11} className="text-emerald-600/70 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md" ref={searchRef}>
        <div className="relative group">
          <Search size={16} className={cn(
            "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 transition-colors duration-200",
            searchQuery ? "text-emerald-600" : "text-text-tertiary"
          )} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            placeholder="Search charity records, news, donations..."
            className="w-full pl-9 sm:pl-12 pr-8 sm:pr-10 py-2 sm:py-2.5 text-sm rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all duration-200"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setShowResults(false); }}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Quick Charity Navigation / Search Dropdown */}
        {showResults && (
          <div className="absolute top-full mt-2 w-full sm:w-80 md:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-slide-in-top z-50 p-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5">Charity Portals & Actions</p>
            <div className="space-y-1">
              <Link
                href="/charity/donations"
                onClick={() => setShowResults(false)}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-emerald-50 rounded-xl transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  <Landmark size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700">Donations & Receipts</p>
                  <p className="text-xs text-slate-400 truncate">Verify donor submissions and bank slips</p>
                </div>
              </Link>
              <Link
                href="/charity/news"
                onClick={() => setShowResults(false)}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-blue-50 rounded-xl transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  <Newspaper size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">News & Announcements</p>
                  <p className="text-xs text-slate-400 truncate">Publish and manage charity stories</p>
                </div>
              </Link>
              <Link
                href="/charity/gallery"
                onClick={() => setShowResults(false)}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-amber-50 rounded-xl transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  <Images size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-700">Gallery & Videos</p>
                  <p className="text-xs text-slate-400 truncate">Manage community photos & YouTube embeds</p>
                </div>
              </Link>
              <Link
                href="/charity/school"
                onClick={() => setShowResults(false)}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-violet-50 rounded-xl transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                  <GraduationCap size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-violet-700">School CMS</p>
                  <p className="text-xs text-slate-400 truncate">Edit programs, facilities, and campus life</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
        {/* Instant Reload Button */}
        <button 
          onClick={() => {
            setIsRefreshing(true);
            window.dispatchEvent(new CustomEvent('app-refresh'));
            setTimeout(() => setIsRefreshing(false), 800);
          }}
          title="Refresh Content"
          className="p-2 sm:p-2.5 rounded-xl hover:bg-primary/5 transition-all duration-200 group active:scale-[0.95]"
        >
          <RotateCw 
            size={18} 
            className={
              isRefreshing 
                ? "animate-spin text-primary sm:w-5 sm:h-5" 
                : "text-text-secondary group-hover:text-primary group-hover:rotate-180 transition-all duration-500 sm:w-5 sm:h-5"
            } 
          />
        </button>

        {/* Notification */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 sm:p-2.5 rounded-xl hover:bg-primary/5 transition-all duration-200 group"
          >
            <Bell size={18} className="text-text-secondary group-hover:text-primary transition-colors sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-danger rounded-full ring-2 sm:ring-4 ring-white flex items-center justify-center">
              </span>
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-danger text-white text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full min-w-[16px] sm:min-w-[18px] text-center shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-24px)] sm:w-80 max-w-80 bg-white rounded-2xl border border-border shadow-2xl shadow-primary/10 overflow-hidden animate-slide-in-top z-50">
              <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-text-primary text-sm sm:text-base">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-[10px] uppercase tracking-wider font-bold text-primary hover:text-primary-dark flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md"
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={cn(
                        "p-3 sm:p-4 border-b border-border/50 hover:bg-gray-50 transition-colors cursor-pointer",
                        !notif.isRead ? "bg-primary/5" : ""
                      )}
                      onClick={() => {
                        if (notif.candidateId) router.push(`/candidates/${notif.candidateId}`);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={cn("mt-0.5 w-2 h-2 rounded-full shrink-0", !notif.isRead ? "bg-primary" : "bg-transparent")} />
                        <div>
                          <p className={cn("text-sm mb-1", !notif.isRead ? "font-bold text-text-primary" : "font-medium text-text-secondary")}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-text-tertiary leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-text-tertiary/70 mt-2 font-medium">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell size={24} className="mx-auto text-text-tertiary opacity-20 mb-3" />
                    <p className="text-sm font-bold text-text-primary">All caught up!</p>
                    <p className="text-xs text-text-tertiary mt-1">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User menu — show name on md+ (only render after mount to avoid hydration mismatch) */}
        {mounted && session?.user && (
          <div className="relative" ref={profileRef}>
            <div 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 sm:gap-3 sm:pl-2 md:pl-4 md:border-l md:border-border/50 cursor-pointer hover:bg-gray-50 rounded-xl sm:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 transition-all duration-200 group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
                <User size={14} className="text-white sm:w-4 sm:h-4" />
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-tighter text-text-tertiary leading-none mb-1">{role.replace('_', ' ')}</p>
                <p className="text-sm font-bold text-text-primary leading-none truncate max-w-[120px]">{session.user.name}</p>
              </div>
              <ChevronDown size={14} className={cn("text-text-tertiary transition-transform duration-200 hidden md:block", profileOpen && "rotate-180")} />
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-border py-2 z-50 animate-slide-in-top">
                <div className="px-4 py-2 border-b border-border mb-1">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-text-tertiary leading-none mb-1.5">{role.replace('_', ' ')}</p>
                  <p className="text-sm font-bold text-text-primary truncate">{session.user.name}</p>
                  <p className="text-[10px] text-text-tertiary truncate">{session.user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
