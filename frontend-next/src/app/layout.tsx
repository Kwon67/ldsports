import './globals.css';
import { Inter, Oswald } from 'next/font/google';
import { Providers } from './providers';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LDSports - Camisas de Futebol Oficiais',
  description:
    'As camisas oficiais dos maiores clubes do mundo. Qualidade premium, frete grátis para todo Brasil.',
  keywords: 'camisas de futebol, camisas oficiais, Flamengo, Real Madrid, Brasil, Nike, Adidas',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LDSports',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${oswald.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ fontFamily: 'var(--font-inter)' }}>
        <Providers>{children}</Providers>
        <FloatingWhatsApp />

        {/* Register Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered:', registration.scope);
                  }).catch(function(error) {
                    console.log('SW registration failed:', error);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
