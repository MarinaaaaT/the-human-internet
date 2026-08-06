import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CheckCircle } from '@/components/icons/CheckCircle';
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { ButtonLink } from '@/components/ui/Button';
import { APP_STORE_URL, ROUTES, SITE_NAME } from '@/content/site';
import { getSupabaseClient } from '@/lib/supabase/server';

import styles from './page.module.css';

// Signed URLs are minted fresh per request — this route can't be statically
// generated, since the response depends on live DB state per photo id.
export const dynamic = 'force-dynamic';

const UUID_SHAPE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Signed URL lifetime, in seconds. Only needs to outlive the initial render. */
const SIGNED_URL_TTL_SECONDS = 60;

interface VerificationPhoto {
  storage_path: string | null;
  username: string | null;
  captured_at: string;
  is_public: boolean;
}

async function getVerificationPhoto(
  photoId: string,
): Promise<VerificationPhoto | null> {
  if (!UUID_SHAPE.test(photoId)) return null;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .rpc('get_verification_photo', { p_photo_id: photoId })
    .maybeSingle<VerificationPhoto>();

  if (error) {
    console.error('get_verification_photo failed:', error.message);
    return null;
  }
  return data;
}

interface PageProps {
  params: Promise<{ photoId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { photoId } = await params;
  const photo = await getVerificationPhoto(photoId);

  if (!photo) {
    return { title: 'photo not found' };
  }

  const title = photo.is_public
    ? `verified by @${photo.username}`
    : 'verified human photo';

  return {
    title,
    description: 'This photo was taken by a real human — verified.',
  };
}

export default async function VerificationPage({ params }: PageProps) {
  const { photoId } = await params;
  const photo = await getVerificationPhoto(photoId);

  if (!photo) {
    notFound();
  }

  let signedPhotoUrl: string | null = null;
  if (photo.is_public && photo.storage_path) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage
      .from('photos')
      .createSignedUrl(photo.storage_path, SIGNED_URL_TTL_SECONDS);
    if (error) {
      console.error('createSignedUrl failed:', error.message);
    }
    signedPhotoUrl = data?.signedUrl ?? null;
  }

  // A public photo whose sign call still failed (storage/object gone,
  // outage) falls through to the gate UI below rather than a broken image —
  // the gate copy reads slightly wrong for that specific case ("the owner
  // chose to hide this"), but it's the safer default and this should only
  // ever happen for a corrupted row.

  const capturedDate = new Date(photo.captured_at).toLocaleDateString(
    'en-US',
    { month: 'long', day: 'numeric', year: 'numeric' },
  );

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
