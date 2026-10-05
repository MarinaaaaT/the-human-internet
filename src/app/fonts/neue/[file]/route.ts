import { getSupabaseClient } from '@/lib/supabase/server';

/**
 * Serves PP Neue Montreal from the private `licensed-fonts` bucket.
 *
 * The files aren't in this repo: our copy is Pangram Pangram's
 * free-for-personal-use release, and both this repo and the site are public.
 * This route downloads them with the anon key, and the bucket's storage
 * policy only lets anon read while the `neue_font` flag is `all` — so with
 * the flag anywhere else every request here 404s, whatever the page or a
 * visitor's dev tools ask for. The gate is the database, not this file.
 */
export const dynamic = 'force-dynamic';

const FILES = new Set([
  'PPNeueMontreal-Regular.otf',
  'PPNeueMontreal-Semibold.otf',
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!FILES.has(file)) return notFound();

  const { data, error } = await getSupabaseClient()
    .storage.from('licensed-fonts')
    .download(file);
  if (error || !data) return notFound();

  return new Response(data, {
    headers: {
      'Content-Type': 'font/otf',
      // Browser-only, and short: switching the flag off should stop the
      // font being served within minutes, so no shared/CDN caching.
      'Cache-Control': 'private, max-age=300',
    },
  });
}

function notFound() {
  return new Response('Not found', {
    status: 404,
    headers: { 'Cache-Control': 'no-store' },
  });
}
