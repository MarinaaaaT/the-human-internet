import { getVerificationPhoto, signedPhotoUrlIfPublic } from '@/lib/photos/verificationPhoto';

/**
 * The verification page's download button. The page's own signed URL lives
 * for 60 seconds, so it can't be the link — this signs a fresh one per click,
 * through the same privacy gate as the page and its card, and redirects to it
 * with Storage set to serve the photo as an attachment. A gated or missing
 * photo 404s, exactly as it would have shown no image.
 */
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ photoId: string }> },
) {
  const { photoId } = await params;
  const photo = await getVerificationPhoto(photoId);
  if (!photo) return notFound();

  const extension = photo.storage_path?.match(/\.[A-Za-z0-9]+$/)?.[0] ?? '.jpg';
  const url = await signedPhotoUrlIfPublic(photo, {
    download: `the-human-internet-${photoId}${extension}`,
  });
  if (!url) return notFound();

  return new Response(null, {
    status: 302,
    headers: { Location: url, 'Cache-Control': 'no-store' },
  });
}

function notFound() {
  return new Response('Not found', {
    status: 404,
    headers: { 'Cache-Control': 'no-store' },
  });
}
