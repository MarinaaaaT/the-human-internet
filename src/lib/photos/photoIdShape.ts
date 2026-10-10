/**
 * The two id formats `/[photoId]` accepts. Kept free of server imports so the
 * client-side analytics filter can use the same definition as the lookup.
 */

const UUID_SHAPE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Base58 (Bitcoin alphabet: no 0/O/I/l), matches `photos.short_code` and the
// app's `VerifiedPhoto.generateShortCode()`.
const SHORT_CODE_SHAPE = /^[123456789A-HJ-NP-Za-km-z]{8}$/;

export function isPhotoIdShape(value: string): boolean {
  return UUID_SHAPE.test(value) || SHORT_CODE_SHAPE.test(value);
}
