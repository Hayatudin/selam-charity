import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Inquiries',
  description: 'Connect with Selam Charity & School in Addis Ababa, Ethiopia. Find our address, phone, email, office hours, or send an inquiry.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
