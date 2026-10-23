import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://billbreaker-beta.vercel.app'),
  title: 'BillBreaker — Find out which appliance is consuming your light bill.',
  description:
    'Add your appliances, see what each one costs per month, and learn which changes save you the most money. Free, no signup, works offline.',
  applicationName: 'BillBreaker',
  keywords: [
    'electricity bill calculator',
    'appliance power consumption',
    'prepaid meter token calculator',
    'Nigeria electricity tariff calculator',
    'kWh cost calculator',
    'generator fuel calculator',
    'household energy savings',
    'BillBreaker',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BillBreaker',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'BillBreaker',
    title: 'BillBreaker — Find out which appliance is consuming your light bill.',
    description:
      'Add your appliances, see what each one costs, and learn which changes save you the most money. Free, no signup, works offline.',
    url: 'https://billbreaker-beta.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BillBreaker — Find out which appliance is consuming your light bill.',
    description:
      'Add your appliances, see what each one costs, and learn which changes save you the most money.',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#F59E0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans bg-[#FFFBF2] text-[#1F2937] antialiased selection:bg-[#F59E0B]/30">
        {children}
      </body>
    </html>
  );
}
