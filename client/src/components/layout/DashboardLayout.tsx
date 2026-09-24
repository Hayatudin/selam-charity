'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { cn } from '@/lib/utils';
import { useSession, getSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    // 1. In-memory session resolved
    if (session) {
      setIsVerifying(false);
      return;
    }

    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('selam_session_token') : null;

    // 2. Still loading and no saved token
    if (isPending && !savedToken) {
      setIsVerifying(true);
      return;
    }

    // 3. No in-memory session and no token anywhere
    if (!isPending && !savedToken) {
      window.location.href = '/login';
      return;
    }

    // 4. Verify session asynchronously
    const verify = async () => {
      try {
        // Try Better Auth getSession first
        const res = await getSession();
        if (!isMounted) return;
        if (res?.data) {
          setIsVerifying(false);
          return;
        }

        // Fallback: direct check with Bearer token if getSession cookie wasn't picked up
        if (savedToken) {
          const directRes = await fetch('/api/auth/get-session', {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          const directData = await directRes.json().catch(() => null);
          if (!isMounted) return;
          if (directData && directData.user) {
            setIsVerifying(false);
            return;
          }
        }

        // Truly unauthenticated
        if (typeof window !== 'undefined') {
          localStorage.removeItem('selam_session_token');
          localStorage.removeItem('selam_user');
        }
        window.location.href = '/login';
      } catch (err) {
        if (!isMounted) return;
        // In local development or network hiccup, don't kick user out if they have a saved token
        if (savedToken) {
          setIsVerifying(false);
        } else {
          window.location.href = '/login';
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [session, isPending]);

  // Close mobile sidebar on route change or resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  if (isPending || (isVerifying && !session)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-semibold text-text-secondary">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!session && !isVerifying) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-100 w-full overflow-hidden">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onNavigate={() => {}}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          {/* Sidebar drawer */}
          <div
            className="absolute left-0 top-0 h-full w-72 animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              isCollapsed={false}
              setIsCollapsed={() => {}}
              isMobile
              onNavigate={() => setIsMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div id="main-scroll-container" className="flex-1 flex flex-col h-screen relative overflow-y-auto scroll-smooth">
        <Topbar
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          isSidebarCollapsed={isCollapsed}
          onSidebarToggle={() => setIsCollapsed(prev => !prev)}
        />
        <main className="flex-1 p-3 sm:p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
