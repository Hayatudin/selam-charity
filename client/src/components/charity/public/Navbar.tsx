'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Globe,
  Check
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { DASHBOARD_ROLES } from '@/lib/role-config';

export default function CharityNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [language, setLanguage] = useState<'En' | 'Ar'>('En');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const pathname = usePathname();
  const { data: session } = useSession();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const langTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const userRole = (session?.user as any)?.role;
  const isStaffOrAdmin = userRole && DASHBOARD_ROLES.includes(userRole);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setLangDropdownOpen(false);
  }, [pathname]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setAboutDropdownOpen(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 180);
  };

  const handleLangMouseEnter = () => {
    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    setLangDropdownOpen(true);
  };

  const handleLangMouseLeave = () => {
    langTimeoutRef.current = setTimeout(() => {
      setLangDropdownOpen(false);
    }, 180);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Floating Pill Navbar Container */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-5 px-3 sm:px-4 flex justify-center pointer-events-none transition-all duration-300">
        <div className="pointer-events-auto w-full max-w-6xl rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100/90 px-5 sm:px-8 py-1.5 sm:py-2 flex items-center justify-between">

          {/* Logo (Increased Size as requested) */}
          <Link href="/" className="flex items-center shrink-0 group">
            <img
              src="/Selam-logo-01.jpg"
              alt="Selam Charity & Development Association"
              className="h-11 sm:h-13 w-auto object-contain transition-transform duration-200"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className={`text-[15px] font-medium transition-colors ${isActive('/') && pathname === '/'
                  ? 'text-emerald-800 font-semibold'
                  : 'text-slate-800 hover:text-emerald-800'
                }`}
            >
              Home
            </Link>

            {/* About Dropdown (Seamless hover bridge to prevent disappearing) */}
            <div
              ref={dropdownRef}
              className="relative py-2"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <Link
                href="/about"
                onClick={(e) => {
                  // Allow click to toggle dropdown or navigate
                  setAboutDropdownOpen(!aboutDropdownOpen);
                }}
                className={`inline-flex items-center gap-1 text-[15px] font-medium transition-colors ${isActive('/about')
                    ? 'text-emerald-800 font-semibold'
                    : 'text-slate-800 hover:text-emerald-800'
                  }`}
              >
                <span>About</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180 text-emerald-800' : 'text-slate-600'}`} />
              </Link>

              {/* Seamless Submenu Container (pt-2 padding acts as invisible bridge) */}
              {aboutDropdownOpen && (
                <div
                  className="absolute top-full left-0 pt-2 w-52 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleAboutMouseEnter}
                  onMouseLeave={handleAboutMouseLeave}
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden">
                    <Link
                      href="/about#background"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition-colors font-medium"
                    >
                      Background
                    </Link>
                    <Link
                      href="/about#objectives"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition-colors font-medium"
                    >
                      Our objectives
                    </Link>
                    <Link
                      href="/about#members"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition-colors font-medium"
                    >
                      Members
                    </Link>
                    <Link
                      href="/about#testimonials"
                      onClick={() => setAboutDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition-colors font-medium"
                    >
                      Testimonials
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/school"
              className={`text-[15px] font-medium transition-colors ${isActive('/school')
                  ? 'text-emerald-800 font-semibold'
                  : 'text-slate-800 hover:text-emerald-800'
                }`}
            >
              School
            </Link>

            <Link
              href="/gallery"
              className={`text-[15px] font-medium transition-colors ${isActive('/gallery')
                  ? 'text-emerald-800 font-semibold'
                  : 'text-slate-800 hover:text-emerald-800'
                }`}
            >
              Gallery
            </Link>

            <Link
              href="/news"
              className={`text-[15px] font-medium transition-colors ${isActive('/news')
                  ? 'text-emerald-800 font-semibold'
                  : 'text-slate-800 hover:text-emerald-800'
                }`}
            >
              News
            </Link>

            <Link
              href="/donate"
              className={`text-[15px] font-medium transition-colors ${isActive('/donate')
                  ? 'text-emerald-800 font-semibold'
                  : 'text-slate-800 hover:text-emerald-800'
                }`}
            >
              Donate
            </Link>

            <Link
              href="/contact"
              className={`text-[15px] font-medium transition-colors ${isActive('/contact')
                  ? 'text-emerald-800 font-semibold'
                  : 'text-slate-800 hover:text-emerald-800'
                }`}
            >
              Contacts
            </Link>
          </nav>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-4">

            {/* Language Dropdown (Before Sign in button) */}
            <div
              ref={langRef}
              className="relative py-2"
              onMouseEnter={handleLangMouseEnter}
              onMouseLeave={handleLangMouseLeave}
            >
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-slate-700 hover:text-emerald-800 hover:bg-slate-100 transition-all border border-slate-200 cursor-pointer shadow-2xs"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-semibold">{language}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 text-emerald-800' : ''}`} />
              </button>

              {/* Seamless Language Submenu */}
              {langDropdownOpen && (
                <div
                  className="absolute top-full right-0 pt-2 w-36 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleLangMouseEnter}
                  onMouseLeave={handleLangMouseLeave}
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => { setLanguage('En'); setLangDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${language === 'En'
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-800 font-medium'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>English</span>
                        <span className="text-[11px] text-slate-400 font-normal">(En)</span>
                      </div>
                      {language === 'En' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLanguage('Ar'); setLangDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${language === 'Ar'
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-800 font-medium'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>العربية</span>
                        <span className="text-[11px] text-slate-400 font-normal">(Ar)</span>
                      </div>
                      {language === 'Ar' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sign in / Dashboard Button */}
            {session ? (
              <Link
                href={isStaffOrAdmin ? '/charity/dashboard' : '/dashboard'}
                className="text-sm font-medium text-slate-700 hover:text-emerald-800 transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 hover:text-emerald-800 transition-colors"
              >
                Sign in
              </Link>
            )}

            {/* Apply now Button */}
            <Link
              href="/school#programs"
              className="rounded-full bg-[#185a3a] hover:bg-[#12422a] text-white px-6 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply now
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Language Toggle for Mobile */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'En' ? 'Ar' : 'En')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700"
            >
              <Globe className="w-3 h-3 text-emerald-700" />
              <span>{language}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Dropdown Card */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="fixed top-20 left-4 right-4 max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <img
                src="/Selam-logo.jpg"
                alt="Selam Charity"
                className="h-12 w-auto object-contain"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                Home
              </Link>

              {/* About with expandable Submenu */}
              <div>
                <div className="px-4 py-2.5 text-base font-semibold text-emerald-800">
                  About
                </div>
                <div className="pl-6 space-y-1">
                  <Link
                    href="/about#background"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                  >
                    Background
                  </Link>
                  <Link
                    href="/about#objectives"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                  >
                    Our objectives
                  </Link>
                  <Link
                    href="/about#members"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                  >
                    Members
                  </Link>
                  <Link
                    href="/about#testimonials"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                  >
                    Testimonials
                  </Link>
                </div>
              </div>

              <Link
                href="/school"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                School
              </Link>
              <Link
                href="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                Gallery
              </Link>
              <Link
                href="/news"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                News
              </Link>
              <Link
                href="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive('/donate') ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-800 hover:bg-slate-50'}`}
              >
                Donate
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                Contacts
              </Link>
            </div>

            {/* Language Selector in Mobile */}
            <div className="py-3 px-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Language:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLanguage('En')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'En' ? 'bg-[#185a3a] text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                >
                  English (En)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('Ar')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${language === 'Ar' ? 'bg-[#185a3a] text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                >
                  العربية (Ar)
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/school#programs"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-[#185a3a] text-white font-semibold text-sm shadow-sm"
              >
                Apply now
              </Link>

              {session ? (
                <Link
                  href={isStaffOrAdmin ? '/charity/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
