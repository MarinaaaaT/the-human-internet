import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { SiteAnalytics } from '@/components/SiteAnalytics';
import { isPublicFlagEnabled } from '@/lib/featureFlags';
import { SITE_URL } from '@/lib/site';

import '@/styles/globals.css';

/**
 * Inter Display, self-hosted from src/fonts (SIL Open Font License — see the
 * OFL.txt beside it). Matches the static cuts bundled in the iOS app, so both
 * surfaces set the same type. The design system has one weight (Medium), so
 * only that cut is loaded; the others stay on disk for the app's sake.
 */
const interDisplay = localFont({
  src: [{ path: '../fonts/inter-display/InterDisplay-Medium.woff2', weight: '500' }],
  display: 'swap',
  variable: '--font-inter-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'the human internet',
    template: '%s · the human internet',
  },
  description:
    'Keep the internet alive with proof that real people are behind the content they create. No bots. No AI. Just humans around the world making and sharing things they care about.',
  openGraph: {
    type: 'website',
    siteName: 'the human internet',
    title: 'the human internet',
    description:
      'Proof that real people are behind the content they create. No bots. No AI.',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // "Neue Font: Pay To Enable". Only switches which family the CSS asks for;
  // whether the files can actually be fetched is decided by the storage
  // policy behind /fonts/neue — see that route.
  const neueFont = await isPublicFlagEnabled('neue_font');

  return (
    <html
      lang="en"
      className={interDisplay.variable}
      data-font={neueFont ? 'neue' : undefined}
    >
      <body>
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
