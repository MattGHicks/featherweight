import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { SiteHeader } from '@/components/layout/site-header';
import { AuthProvider } from '@/components/providers/session-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Featherweight - Ultralight Gear Management',
  description:
    'A modern gear management app for ultralight backpackers. Track your gear weight, create pack lists, and optimize your base weight.',
  keywords: [
    'ultralight backpacking',
    'gear management',
    'base weight',
    'pack lists',
    'hiking gear',
  ],
  authors: [{ name: 'Featherweight Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
            >
              Skip to main content
            </a>
            <SiteHeader />
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
