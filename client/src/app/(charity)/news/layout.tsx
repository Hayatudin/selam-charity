import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News & Announcements',
  description: 'Latest news, project updates, educational achievements, and announcements from Selam Charity and School.',
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
