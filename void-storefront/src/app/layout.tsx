import type { Metadata, Viewport } from 'next';
import { storeConfig } from '@/config/store';
import { Header, Footer } from '@/components/layout';
import { ToastProvider } from '@/components/ui';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${storeConfig.siteName} - ${storeConfig.tagline}`,
    template: `%s | ${storeConfig.siteName}`,
  },
  description: storeConfig.description,
  keywords: ['digital products', 'subscription', 'access', 'void'],
  authors: [{ name: storeConfig.siteName }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: storeConfig.siteName,
    title: `${storeConfig.siteName} - ${storeConfig.tagline}`,
    description: storeConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${storeConfig.siteName} - ${storeConfig.tagline}`,
    description: storeConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: storeConfig.theme.backgroundColor,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col noise-bg">
        <ToastProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
