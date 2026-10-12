import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Schools & Educational Network | KG to Grade 9',
  description: 'Establishing accredited schools across diverse cities, providing classrooms with wooden desks, exercise books, pens, and supplies from Kindergarten to Grade 9.',
};

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
