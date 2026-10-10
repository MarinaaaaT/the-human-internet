import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import {
  formatCapturedAt,
  getVerificationPhoto,
  signedPhotoUrlIfPublic,
} from '@/lib/photos/verificationPhoto';
import { colors } from '@/styles/tokens';

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
 * Tailwind classes, so the palette comes from the generated
 * `src/styles/tokens.ts` — the same tokens.json values as the CSS, written
 * out literally.
 */
const COLOR = {
  background: colors.background,
  foreground: colors.foreground,
  muted: colors.mutedForeground,
} as const;

/**
 * The spiral, from the same file the site uses (public/brand/mark.svg) —
 * "verified" is always the mark, never a check. Satori's renderer rejects
 * that file as an <img>, so its one path is lifted out and drawn inline.
 * Read once per server instance, as Next's opengraph-image docs do for
 * local assets.
 */
const MARK_PATH = (
  await readFile(join(process.cwd(), 'public/brand/mark.svg'), 'utf8')
).match(/\sd="([^"]+)"/)?.[1];

/** The mark's viewBox, so it never stretches. */
const MARK_VIEWBOX = { width: 1402, height: 1482 };

function Mark({ size: width }: { size: number }) {
  if (!MARK_PATH) return null;
  return (
    <svg
      width={width}
      height={Math.round((width * MARK_VIEWBOX.height) / MARK_VIEWBOX.width)}
      viewBox={`0 0 ${MARK_VIEWBOX.width} ${MARK_VIEWBOX.height}`}
      fill={COLOR.foreground}
    >
      <path fillRule="evenodd" d={MARK_PATH} />
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
            backgroundColor: COLOR.background,
            padding: 80,
          }}
        >
          <Mark size={96} />
          <div
            style={{
              marginTop: 40,
              fontSize: 64,
              fontWeight: 500,
              color: COLOR.foreground,
              textAlign: 'center',
              lineHeight: 1,
              letterSpacing: '-0.035em',
            }}
          >
            A photo taken by a real human.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              color: COLOR.muted,
              textAlign: 'center',
            }}
          >
            {photo
              ? 'This human shares their photos with other humans only.'
              : 'Proof that real people are behind the content they create.'}
          </div>
          <div style={{ marginTop: 48, fontSize: 26, color: COLOR.foreground }}>
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
          backgroundColor: COLOR.background,
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
            backgroundColor: COLOR.background,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mark size={34} />
            <div
              style={{
                marginLeft: 12,
                fontSize: 24,
                color: COLOR.muted,
              }}
            >
              Verified human
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 52,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: '-0.035em',
              color: COLOR.foreground,
            }}
          >
            This photo was taken by a real, verified human.
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: COLOR.foreground,
            }}
          >
            {`@${photo.username}`}
          </div>
          <div style={{ marginTop: 8, fontSize: 24, color: COLOR.muted }}>
            {`Captured ${formatCapturedAt(photo.captured_at)}`}
          </div>

          <div style={{ marginTop: 44, fontSize: 24, color: COLOR.foreground }}>
            the-human-internet.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
