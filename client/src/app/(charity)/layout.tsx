import React from 'react';
import CharityNavbar from '@/components/charity/public/Navbar';
import CharityFooter from '@/components/charity/public/Footer';

export const metadata = {
  title: {
    default: 'Selam Charity Organization | Building Schools, Mosques & Water Wells',
    template: '%s | Selam Charity',
  },
  description: 'Official portal of Selam Charity Organization in Ethiopia. Committed to establishing schools from KG to Grade 9, supplying classroom materials, mosque establishment, yatim (orphan) care, and clean water wells.',
  keywords: [
    'Charity',
    'Ethiopia',
    'Schools KG to Grade 9',
    'Desks and School Supplies',
    'Mosque Building',
    'Yatim Orphan Care',
    'Water Wells Bir',
    'CSO Ethiopia',
  ],
  authors: [{ name: 'Selam Charity Organization' }],
  openGraph: {
    title: 'Selam Charity Organization',
    description: 'Establishing schools from KG to Grade 9, supplying classroom materials, building mosques, caring for yatim (orphans), and drilling clean water wells.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Selam Charity',
  },
};

export default function CharityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <CharityNavbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <CharityFooter />
    </div>
  );
}
