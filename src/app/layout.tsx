import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Jobify AI | Resume Analyzer',
  description: 'Get expert feedback on your resume using AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ background: '#050505' }}>
        <Providers>
          <ParticlesBackground />
          <Navbar />
          <main className="content-wrapper">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
