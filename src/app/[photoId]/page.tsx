import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProofCard } from '@/components/brand/ProofCard';
import { ShareActions } from '@/components/brand/ShareActions';
import { VerifiedMark } from '@/components/brand/VerifiedMark';
import { SiteHeader } from '@/components/marketing/SiteHeader';
import { Button } from '@/components/ui/button';
import { APP_STORE_URL, ROUTES, SITE_NAME } from '@/content/site';
import { parseSocialLinks } from '@/lib/photos/socialLinks';
import {
  DEMO_DISCLAIMER,
  formatCapturedAt,
  getVerificationPhoto,
  signedPhotoUrlIfPublic,
} from '@/lib/photos/verificationPhoto';

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
    return {
      title: 'photo not found',
      openGraph: { title: 'photo not found' },
      robots: { index: false },
    };
  }

  const title = photo.is_demo
    ? 'demo account photo'
    : photo.is_public
      ? `verified by @${photo.username}`
      : 'verified human photo';
  const description = photo.is_demo
    ? DEMO_DISCLAIMER
    : 'This photo was taken by a real human — verified.';

  // `openGraph` has to restate the title and description rather than
  // inheriting them from the fields above: the root layout declares its own
  // `openGraph` block, and an explicit parent value wins over a child's
  // plain `title`/`description`. Without this the card for someone's photo
  // was captioned with the site's generic marketing copy.
  //
  // `openGraph.images` is deliberately *not* set — the sibling
  // `opengraph-image` route supplies it by file convention, and a value
  // here would override that. It applies its own privacy gate.
  //
  // `noindex`: these pages unfurl wherever a link is pasted, but can carry
  // an owner's verified name and handles, so they stay out of search
  // results. robots.ts leaves them crawlable so this tag can be seen.
  return {
    title,
    description,
    openGraph: { title, description },
    robots: { index: false },
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

  // What the owner chose to put on this page beyond the photo. Already gated
  // in `get_verification_photo()` — unverified or Humans Only arrives as
  // `[]` — so there is no privacy decision left to make here, only whether
  // there is anything to draw.
  const socialLinks = parseSocialLinks(photo.social_links);

  const showPhoto = photo.is_public && signedPhotoUrl;

  return (
    <>
      <SiteHeader alwaysVisible />
      <main className="min-h-svh pt-24 pb-24">
        <div className="mx-auto flex max-w-app flex-col gap-4 px-6">
          <div className="flex items-center gap-3 rounded-md bg-surface p-4">
            {photo.is_demo ? (
              /* No spiral: it means verified, and this box says the
                 opposite. */
              <p className="text-title text-foreground">{DEMO_DISCLAIMER}</p>
            ) : (
              <>
                <VerifiedMark className="h-7" />
                {/* `is_verified` is Stripe Identity, gated in the RPC like
                    the rest of the owner's details: a Humans Only photo
                    arrives `false` and reads as a plain "real human". */}
                <p className="text-title text-foreground">
                  This photo was taken by a real
                  {photo.is_verified ? ', identity verified' : ''} human!
                </p>
              </>
            )}
          </div>

          <p className="mb-4 text-label text-muted-foreground">
            How do you know?{' '}
            <Link
              className="text-foreground underline underline-offset-4 transition-colors duration-fast ease-out hover:text-muted-foreground"
              href={ROUTES.verification}
            >
              Click here to learn more.
            </Link>
          </p>

          {showPhoto ? (
            <>
              <ProofCard
                src={signedPhotoUrl}
                /* The reveal is hidden from screen readers and there is no
                   info card, so the proof rides on the photo's label. */
                alt={`Verified human-captured photo by @${photo.username}, captured ${capturedDate}`}
                width={1200}
                height={1200}
                sizes="(max-width: 440px) 100vw, 440px"
                unoptimized
                priority
                reveal={
                  <>
                    <span>@{photo.username}</span>
                    <span>{capturedDate}</span>
                  </>
                }
                downloadHref={`/${photoId}/download`}
              />

              <p className="text-label text-muted-foreground">
                Click photo to see more information about the creator.
              </p>

              <ShareActions />

              {socialLinks.length > 0 && (
                <section className="border-t border-border pt-5">
                  <ul className="flex flex-wrap gap-2">
                    {/* Keyed by position: nothing stops a user listing
                        the same platform and handle twice. */}
                    {socialLinks.map((link, index) => (
                      <li key={`${index}-${link.platform}-${link.handle}`} className="max-w-full">
                        {/*
                          User-authored destinations: `ugc` and `nofollow`
                          keep them out of our link graph, and
                          `noopener noreferrer` is the usual new-tab
                          hygiene. The href itself is built from a
                          per-platform template in `socialLinks.ts`, never
                          from stored text.
                        */}
                        <Button
                          asChild
                          variant="secondary"
                          className="h-auto min-h-control max-w-full py-2 whitespace-normal"
                        >
                          <a
                            href={link.href}
                            target="_blank"
                            rel="ugc nofollow noopener noreferrer"
                          >
                            <span className="text-muted-foreground">{link.label}</span>
                            {/* Handles are capped at 64 characters and can be
                                a solid run of them, so this is the one place
                                on the page that can force a horizontal scroll. */}
                            <span className="min-w-0 wrap-anywhere">{link.display}</span>
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-lg bg-surface px-6 py-8 text-center">
              <p className="text-body text-foreground">
                The human behind this photo decided they only want other
                humans to see their photos.
              </p>
              <p className="text-body text-muted-foreground">
                Join {SITE_NAME} to see exact photo contents.
              </p>
              <div className="mt-4 flex flex-col items-center gap-1">
                <Button asChild>
                  <a href={APP_STORE_URL}>Download app</a>
                </Button>
                <Button asChild variant="tertiary">
                  <a href="#">Open in app</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
