import { isPhotoIdShape } from '@/lib/photos/photoIdShape';
import { isReportReason } from '@/lib/photos/reportReasons';
import { getSupabaseClient } from '@/lib/supabase/server';

/**
 * The verification page's "Report this photo". Visitors are signed out, so
 * this goes through the `report_photo(p_lookup, p_reason)` security-definer
 * function rather than the table: it only accepts a photo whose owner is
 * `Public`, caps anonymous reports per photo per day, and answers the same
 * whether or not anything was written — so neither this route nor the
 * function says whether a link exists.
 */
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ photoId: string }> },
) {
  const { photoId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const reason = (body as { reason?: unknown } | null)?.reason;

  if (!isPhotoIdShape(photoId) || !isReportReason(reason)) {
    return respond(400);
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.rpc('report_photo', {
    p_lookup: photoId,
    p_reason: reason,
  });

  if (error) {
    console.error('report_photo failed:', error.message);
    return respond(500);
  }
  return respond(204);
}

function respond(status: number) {
  return new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
}
