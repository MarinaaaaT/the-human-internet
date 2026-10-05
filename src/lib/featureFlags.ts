import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';

/**
 * Feature flags this site is allowed to read.
 *
 * The site holds only the anon key and has no access to `feature_flags`.
 * `public_feature_flag_enabled(p_key)` (security definer) answers for an
 * allowlist of keys hard-coded in that function, so adding one here also
 * means adding it there — an unlisted key just reads `false`.
 *
 * Only `all` counts as on: visitors are anonymous, so there is no audience
 * for `admin` to resolve against.
 *
 * Reading a flag here only decides what the page *asks for*. Anything that
 * must actually stay private behind a flag has to be enforced in the
 * database too, as `neue_font` is by the `licensed-fonts` storage policy —
 * a visitor can edit this page's HTML, but not that policy.
 */
export type PublicFlagKey = 'neue_font';

/** How long a flag change takes to reach the site. */
const FLAG_REVALIDATE_SECONDS = 60;

export const isPublicFlagEnabled = cache(
  async (key: PublicFlagKey): Promise<boolean> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !anonKey) return false;

    const supabase = createClient(url, anonKey, {
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, next: { revalidate: FLAG_REVALIDATE_SECONDS } }),
      },
    });

    const { data, error } = await supabase.rpc('public_feature_flag_enabled', {
      p_key: key,
    });
    // An unreadable flag is an off flag — same direction as the app.
    if (error) return false;
    return data === true;
  },
);
