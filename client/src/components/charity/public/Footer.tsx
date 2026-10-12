'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CharityFooter() {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">

          {/* Col 1 & 2: Branding & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">{t('SELAM Charity', 'SELAM')}</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest -mt-1">
                  {t('Charity Organization')}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              {t(
                'Dedicated to establishing schools across cities from KG to Grade 9, supplying classroom materials, building mosques, supporting yatim (orphans), and providing clean water wells (bir).'
              )}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t('CSO License #8849')}
              </span>
              <span className="text-xs text-slate-500">{t('Addis Ababa, Ethiopia')}</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t('Navigation')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">{t('Home')}</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">{t('About Organization')}</Link>
              </li>
              <li>
                <Link href="/school" className="hover:text-emerald-400 transition-colors">{t('Schools & Education')}</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-emerald-400 transition-colors">{t('Photo & Video Gallery')}</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-emerald-400 transition-colors">{t('Latest News & Updates')}</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">{t('Contact & Support')}</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Core Programs */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t('Our Core Programs')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>{t('School Construction (KG - Grade 9)')}</li>
              <li>{t('Desks & Educational Supplies')}</li>
              <li>{t('Mosque Establishment')}</li>
              <li>{t('Yatim (Orphan) Care & Sponsorship')}</li>
              <li>{t('Water Wells & Clean Water (Bir)')}</li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t('Contact Us')}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t('Sarbet, Addis Ababa, Ethiopia')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span dir="ltr">
                  <a href="tel:0911624839" className="hover:text-emerald-400 transition-colors">0911624839</a> / <a href="tel:0944222924" className="hover:text-emerald-400 transition-colors">0944222924</a>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@selamcharity.org</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t('Monday - Friday: 8:30 AM - 5:30 PM (EAT)')}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t('All rights reserved. Selam Charity & Development Association is a registered non-profit organization in Ethiopia under CSO License No. 8849.')}</p>

          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-400 transition-colors">{t('Governance & Transparency', 'الحوكمة والشفافية')}</Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">{t('Privacy & Terms', 'الشروط والخصوصية')}</Link>
            <Link href="/login" className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400">
              <span>{t('Staff & Admin Portal', 'بوابة الموظفين والإدارة')}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
