import { ImageResponse } from 'next/og';

import {
  formatCapturedAt,
  getVerificationPhoto,
  signedPhotoUrlIfPublic,
} from '@/lib/photos/verificationPhoto';

/**
 * The Open Graph card for a verification link.
 *
 * This is the surface that does the persuading: a verification link pasted
 * into Facebook, Messages, X, Reddit or Slack is rendered from these tags,
 * so without a card the app's whole share flow lands as a bare grey text
 * row. Here it lands as the photo plus the verified claim.
 *
 * Two things about this file are load-bearing:
 *
 * 1. It is `force-dynamic`, for the same reason `page.tsx` is — the owner
 *    can change their privacy at any time, and a cached card would keep
 *    serving a photo they have since gated. (Platforms cache their own
 *    scrape on their side, which is outside our control; the point is not
 *    to add a second cache underneath that one.)
 * 2. The privacy gate is `signedPhotoUrlIfPublic`, shared with the page
 *    rather than reimplemented — see that function for why.
 */

export const dynamic = 'force-dynamic';

export const alt = 'A photo verified as taken by a real human';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Width of the photo panel; the copy gets the remaining `size.width`. */
const PHOTO_PANEL_WIDTH = 540;

/**
 * Satori (which renders this) resolves neither CSS custom properties nor
 * CSS Modules, so — unlike everywhere else in this repo — the palette has
 * to be written out literally. These are copies of the tokens named in the
 * comments; keep them in step with `src/styles/tokens.css`.
 */
const COLOR = {
  ink: '#0c0e10', // --ink
  surface: '#14171a', // --slate-900
  border: '#282f33', // --slate-800
  textPrimary: '#fbfcfc', // --fog-50
  textSecondary: '#aab5ba', // --fog-400
  accent: '#5a94a0', // --cyan-500 / --verified
} as const;

function VerifiedBadge({ size: iconSize }: { size: number }) {
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={COLOR.accent}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ photoId: string }>;
}) {
  const { photoId } = await params;
  const photo = await getVerificationPhoto(photoId);
  const signedPhotoUrl = photo ? await signedPhotoUrlIfPublic(photo) : null;

  // Three cases collapse into two layouts. A photo we can show gets the
  // split card; a gated photo, a missing one, and a public one whose
  // signing call failed all get the wordmark card — none of them may
  // render pixels, and the copy below is written to be true of all three.
  if (!photo || !signedPhotoUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: COLOR.ink,
            padding: 80,
          }}
        >
          <VerifiedBadge size={96} />
          <div
            style={{
              marginTop: 40,
              fontSize: 60,
              fontWeight: 700,
              color: COLOR.textPrimary,
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            A photo taken by a real human
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              color: COLOR.textSecondary,
              textAlign: 'center',
            }}
          >
            {photo
              ? 'This human shares their photos with other humans only.'
              : 'Proof that real people are behind the content they create.'}
          </div>
          <div style={{ marginTop: 48, fontSize: 26, color: COLOR.accent }}>
            the-human-internet.com
          </div>
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: COLOR.ink,
        }}
      >
        {/* Cropped to fill at full card height, so a portrait or a
            landscape capture both fill the panel instead of letterboxing. */}
        <img
          src={signedPhotoUrl}
          alt=""
          width={PHOTO_PANEL_WIDTH}
          height={size.height}
          style={{ objectFit: 'cover', flexShrink: 0 }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            // An explicit width, not `flexGrow` — Satori only wraps text
            // inside a box whose width it already knows, and the heading
            // below ran off the edge of the card without this.
            width: size.width - PHOTO_PANEL_WIDTH,
            height: '100%',
            padding: '0 56px',
            backgroundColor: COLOR.surface,
            borderLeft: `1px solid ${COLOR.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedBadge size={34} />
            <div
              style={{
                marginLeft: 12,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: COLOR.accent,
              }}
            >
              VERIFIED HUMAN
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 46,
              fontWeight: 700,
              lineHeight: 1.15,
              color: COLOR.textPrimary,
            }}
          >
            This photo was taken by a real, verified human.
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              color: COLOR.textSecondary,
            }}
          >
            {`@${photo.username}`}
          </div>
          <div style={{ marginTop: 8, fontSize: 24, color: COLOR.textSecondary }}>
            {`captured ${formatCapturedAt(photo.captured_at)}`}
          </div>

          <div style={{ marginTop: 44, fontSize: 24, color: COLOR.accent }}>
            the-human-internet.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
