import { createClient } from '@supabase/supabase-js';

/**
 * Publishable-key client for use in Server Components. The publishable key
 * is not a secret — the security boundary for anonymous reads is the
 * `get_verification_photo()` Postgres function (security definer, scoped to
 * one photo id at a time) and the storage RLS policy on the `photos`
 * bucket, not the secrecy of this key.
 */
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    );
  }

  return createClient(url, key);
}
