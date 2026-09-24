import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Selam School - Academic Programs & Campus Life',
  description: 'Explore Selam School educational pathways from Kindergarten to Grade 8, science labs, athletic clubs, and student dining.',
};

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
