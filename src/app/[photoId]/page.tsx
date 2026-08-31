import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CheckCircle } from '@/components/icons/CheckCircle';
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { ButtonLink } from '@/components/ui/Button';
import { APP_STORE_URL, ROUTES, SITE_NAME } from '@/content/site';
import {
  formatCapturedAt,
  getVerificationPhoto,
  signedPhotoUrlIfPublic,
} from '@/lib/photos/verificationPhoto';

import styles from './page.module.css';

// Signed URLs are minted fresh per request — this route can't be statically
// generated, since the response depends on live DB state per photo id.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ photoId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { photoId } = await params;
  const photo = await getVerificationPhoto(photoId);

  if (!photo) {
    return { title: 'photo not found', openGraph: { title: 'photo not found' } };
  }

  const title = photo.is_public
    ? `verified by @${photo.username}`
    : 'verified human photo';
  const description = 'This photo was taken by a real human — verified.';

  // `openGraph` has to restate the title and description rather than
  // inheriting them from the fields above: the root layout declares its own
  // `openGraph` block, and an explicit parent value wins over a child's
  // plain `title`/`description`. Without this the card for someone's photo
  // was captioned with the site's generic marketing copy.
  //
  // `openGraph.images` is deliberately *not* set — the sibling
  // `opengraph-image` route supplies it by file convention, and a value
  // here would override that. It applies its own privacy gate.
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function VerificationPage({ params }: PageProps) {
  const { photoId } = await params;
  const photo = await getVerificationPhoto(photoId);

  if (!photo) {
    notFound();
  }

  const signedPhotoUrl = await signedPhotoUrlIfPublic(photo);

  // A public photo whose sign call still failed (storage/object gone,
  // outage) falls through to the gate UI below rather than a broken image —
  // the gate copy reads slightly wrong for that specific case ("the owner
  // chose to hide this"), but it's the safer default and this should only
  // ever happen for a corrupted row.

  const capturedDate = formatCapturedAt(photo.captured_at);

  return (
    <>
      <SiteHeader alwaysVisible />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.badgeCard}>
            <CheckCircle className={styles.badgeIcon} />
            <p className={styles.badgeHeading}>
              This photo was taken by a real
              {photo.is_public && signedPhotoUrl ? ', verified' : ''} human!
            </p>
          </div>

          <p className={styles.learnMore}>
            <span className={styles.learnMorePrompt}>How do you know? </span>
            <Link className={styles.learnMoreLink} href={ROUTES.verification}>
              Click here to learn more.
            </Link>
          </p>

          {photo.is_public && signedPhotoUrl ? (
            <>
              <div className={styles.photoFrame}>
                <Image
                  className={styles.photo}
                  src={signedPhotoUrl}
                  alt="Verified human-captured photo"
                  width={1200}
                  height={1200}
                  sizes="(max-width: 560px) 100vw, 560px"
                  unoptimized
                />
              </div>
              <p className={styles.caption}>
                verified by <strong>@{photo.username}</strong> · captured{' '}
                {capturedDate}
              </p>
            </>
          ) : (
            <div className={styles.gate}>
              <p className={styles.gateText}>
                The human behind this photo decided they only want other
                humans to see their photos.
              </p>
              <p className={styles.gateText}>
                Join {SITE_NAME} to see exact photo contents.
              </p>
              <div className={styles.gateActions}>
                <ButtonLink href={APP_STORE_URL} variant="solid" size="md">
                  Download app
                </ButtonLink>
                <a className={styles.openInApp} href="#">
                  Open in app
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
