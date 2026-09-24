import React from 'react';
import CharityNavbar from '@/components/charity/public/Navbar';
import CharityFooter from '@/components/charity/public/Footer';

export const metadata = {
  title: {
    default: 'Selam Charity & Educational School | Nurturing Minds, Empowering Communities',
    template: '%s | Selam Charity & School',
  },
  description: 'Official portal of Selam Charity Organization and Selam School in Addis Ababa, Ethiopia. Committed to quality education, community health, and compassionate humanitarian action.',
  keywords: [
    'Charity',
    'Ethiopia',
    'Addis Ababa',
    'Selam School',
    'Nonprofit Education',
    'Child Nutrition',
    'Scholarships',
    'CSO Ethiopia',
  ],
  authors: [{ name: 'Selam Charity Organization' }],
  openGraph: {
    title: 'Selam Charity & Educational School',
    description: 'Empowering children and communities through quality schooling, nutrition, and compassionate humanitarian aid in Addis Ababa, Ethiopia.',
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
