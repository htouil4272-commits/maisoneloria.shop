import type { Metadata } from 'next';
import { Cairo, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import ExitIntentPopup from '@/components/shared/ExitIntentPopup';
import RecentPurchaseToast from '@/components/shared/RecentPurchaseToast';
import FacebookPixel from '@/components/tracking/FacebookPixel';
import TikTokPixel from '@/components/tracking/TikTokPixel';
import SnapchatPixel from '@/components/tracking/SnapchatPixel';
import { Suspense } from 'react';
import InternalAnalytics from '@/components/tracking/InternalAnalytics';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://maisoneloria.shop';

export const metadata: Metadata = {
  title: 'ميزون إلوريا | أغطية كراسي فاخرة - Maison Eloria',
  description:
    'أغطية كراسي أنيقة وعملية بجودة عالية. توصيل مجاني لجميع المدن المغربية. الدفع عند الاستلام.',
  keywords: 'أغطية كراسي, كراسي, ديكور, منزل, مغرب, maison eloria',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'ميزون إلوريا | أغطية كراسي فاخرة',
    description: 'أغطية كراسي أنيقة وعملية بجودة عالية. توصيل مجاني للمدن المغربية. الدفع عند الاستلام.',
    type: 'website',
    locale: 'ar_MA',
    siteName: 'Maison Eloria',
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/images/photos/hero-moroccan-salon.png`,
        secureUrl: `${SITE_URL}/images/photos/hero-moroccan-salon.png`,
        width: 1200,
        height: 630,
        alt: 'Maison Eloria — أغطية كراسي فاخرة',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ميزون إلوريا | أغطية كراسي فاخرة',
    description: 'أغطية كراسي أنيقة وعملية بجودة عالية. توصيل مجاني.',
    images: [`${SITE_URL}/images/photos/hero-moroccan-salon.png`],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#143326',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${playfair.variable}`}>
      <body className="font-cairo bg-cream min-h-screen">
        <AnnouncementBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <CheckoutModal />
        <WhatsAppButton />
        <ExitIntentPopup />
        <RecentPurchaseToast />
        <FacebookPixel />
        <TikTokPixel />
        <SnapchatPixel />
        <Suspense fallback={null}>
          <InternalAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
