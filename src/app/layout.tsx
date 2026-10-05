import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { isPublicFlagEnabled } from '@/lib/featureFlags';

import '@/styles/globals.css';

/**
 * Inter Display, self-hosted from src/fonts (SIL Open Font License — see the
 * OFL.txt beside it). Matches the static cuts bundled in the iOS app, so both
 * surfaces set the same type.
 */
const interDisplay = localFont({
  src: [
    { path: '../fonts/inter-display/InterDisplay-Regular.woff2', weight: '400' },
    { path: '../fonts/inter-display/InterDisplay-Medium.woff2', weight: '500' },
    { path: '../fonts/inter-display/InterDisplay-SemiBold.woff2', weight: '600' },
    { path: '../fonts/inter-display/InterDisplay-Bold.woff2', weight: '700' },
    { path: '../fonts/inter-display/InterDisplay-ExtraBold.woff2', weight: '800' },
    { path: '../fonts/inter-display/InterDisplay-Black.woff2', weight: '900' },
  ],
  display: 'swap',
  variable: '--font-inter-display',
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://the-human-internet.com';

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
      <body>{children}</body>
    </html>
  );
}
