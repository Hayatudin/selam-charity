import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media Gallery - Photos & Videos',
  description: 'View photos and videos of campus life, student science labs, sports tournaments, and community health outreach.',
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
