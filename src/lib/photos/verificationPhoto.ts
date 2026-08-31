import { getSupabaseClient } from '@/lib/supabase/server';

/**
 * Lookup and privacy gate for the signed-out verification photo, shared by
 * the `/[photoId]` page and its Open Graph card so the two can't drift.
 *
 * `/[photoId]` is a public API — it's the destination of every verification
 * link the app has ever put on someone's clipboard. See the repo README.
 */

/** Signed URL lifetime, in seconds. Only needs to outlive the initial render. */
export const SIGNED_URL_TTL_SECONDS = 60;

const UUID_SHAPE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Base58 (Bitcoin alphabet: no 0/O/I/l), matches `photos.short_code` and the
// app's `VerifiedPhoto.generateShortCode()`.
const SHORT_CODE_SHAPE = /^[123456789A-HJ-NP-Za-km-z]{8}$/;

export interface VerificationPhoto {
  storage_path: string | null;
  username: string | null;
  captured_at: string;
  is_public: boolean;
}

export async function getVerificationPhoto(
  photoId: string,
): Promise<VerificationPhoto | null> {
  if (!UUID_SHAPE.test(photoId) && !SHORT_CODE_SHAPE.test(photoId)) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .rpc('get_verification_photo', { p_lookup: photoId })
    .maybeSingle<VerificationPhoto>();

  if (error) {
    console.error('get_verification_photo failed:', error.message);
    return null;
  }
  return data;
}

/**
 * Signs a URL for the photo's bytes — but only when the owner's privacy is
 * `Public`.
 *
 * The gate lives here rather than at each call site because there are now
 * two of them, and they must not drift. An Open Graph image is fetched and
 * then cached by every platform the link is pasted into, so a `Humans Only`
 * photo leaking through that surface would be more public, and far harder
 * to walk back, than the same leak on the page itself.
 *
 * Returns `null` for a gated photo *and* for a failed signing call, so
 * callers have one "no image to show" case to handle rather than two.
 */
export async function signedPhotoUrlIfPublic(
  photo: VerificationPhoto,
): Promise<string | null> {
  if (!photo.is_public || !photo.storage_path) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from('photos')
    .createSignedUrl(photo.storage_path, SIGNED_URL_TTL_SECONDS);

  if (error) {
    console.error('createSignedUrl failed:', error.message);
    return null;
  }
  return data?.signedUrl ?? null;
}

/** The one date format shown to signed-out visitors, page and card alike. */
export function formatCapturedAt(capturedAt: string): string {
  return new Date(capturedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
