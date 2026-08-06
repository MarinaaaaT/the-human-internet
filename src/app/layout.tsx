import type { Metadata } from 'next';
import { Archivo, Lato } from 'next/font/google';

import '@/styles/globals.css';

/**
 * The bundled export shipped 16 UUID-named font files (~800KB) inline.
 * next/font self-hosts both families, subsets them, and emits a stable
 * CSS variable — no layout shift and no network hop to Google.
 */
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-body',
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://the-human-internet.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'the human network',
    template: '%s · the human network',
  },
  description:
    'Keep the internet alive with proof that real people are behind the content they create. No bots. No AI. Just humans around the world making and sharing things they care about.',
  openGraph: {
    type: 'website',
    siteName: 'the human network',
    title: 'the human network',
    description:
      'Proof that real people are behind the content they create. No bots. No AI.',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}
