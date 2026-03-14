import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextauth';

export const metadata: Metadata = {
  title: 'IIM Calcutta Silver Jubilee 2026 | Batch 2001',
  description: '25th Silver Jubilee Alumni Meet — December 12-14, 2026, Joka Campus, Kolkata.',
  icons: { icon: 'https://www.iimcal.ac.in/sites/default/files/logo.png' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen" style={{ background: '#F5F0E8' }}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
