import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Our Organization',
  description: 'Learn about the history, founding story, mission, vision, and core values of Selam Charity Organization.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
