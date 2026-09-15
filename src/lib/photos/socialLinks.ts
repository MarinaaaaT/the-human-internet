/**
 * The social handles a verified user chose to show on their verification
 * page — `public.users.social_links`, as read through
 * `get_verification_photo()`.
 *
 * Two rules make this safe to render for signed-out strangers, and both
 * live here rather than at the call site:
 *
 * 1. **Nothing stored becomes an href.** A handle is a bare account name;
 *    every link is built from the `profileUrl` template below. There is no
 *    input that can turn into `javascript:`, another host, or a path of the
 *    attacker's choosing — the worst a hostile value can do is point at the
 *    wrong account on the right platform.
 * 2. **The shape is re-checked here.** `users_social_links_check` already
 *    enforces it in Postgres, but a privacy-relevant surface should not
 *    depend on a constraint in another repo being current. `parseSocialLinks`
 *    drops anything that doesn't match rather than rendering it.
 *
 * `SOCIAL_PLATFORMS` mirrors the whitelist in `is_valid_social_links()` and
 * `SocialPlatform` in the app's `Models.swift`. A platform added to one but
 * not here is simply not shown, which is the right failure direction.
 */

interface PlatformSpec {
  label: string;
  /** `handle` has already passed `HANDLE_SHAPE` when this is called. */
  profileUrl: (handle: string) => string;
  /** How the handle reads on that platform — `@marina`, `u/marina`, … */
  display: (handle: string) => string;
}

const at = (handle: string) => `@${handle}`;
const bare = (handle: string) => handle;

export const SOCIAL_PLATFORMS = {
  instagram: {
    label: 'Instagram',
    profileUrl: (h) => `https://www.instagram.com/${h}/`,
    display: at,
  },
  x: {
    label: 'X',
    profileUrl: (h) => `https://x.com/${h}`,
    display: at,
  },
  tiktok: {
    label: 'TikTok',
    profileUrl: (h) => `https://www.tiktok.com/@${h}`,
    display: at,
  },
  youtube: {
    label: 'YouTube',
    profileUrl: (h) => `https://www.youtube.com/@${h}`,
    display: at,
  },
  linkedin: {
    label: 'LinkedIn',
    profileUrl: (h) => `https://www.linkedin.com/in/${h}`,
    display: bare,
  },
  github: {
    label: 'GitHub',
    profileUrl: (h) => `https://github.com/${h}`,
    display: bare,
  },
  reddit: {
    label: 'Reddit',
    profileUrl: (h) => `https://www.reddit.com/user/${h}`,
    display: (h) => `u/${h}`,
  },
  facebook: {
    label: 'Facebook',
    profileUrl: (h) => `https://www.facebook.com/${h}`,
    display: bare,
  },
} as const satisfies Record<string, PlatformSpec>;

export type SocialPlatform = keyof typeof SOCIAL_PLATFORMS;

/** Mirrors `is_valid_social_links()`'s `^[A-Za-z0-9._-]{1,64}$`. */
const HANDLE_SHAPE = /^[A-Za-z0-9._-]{1,64}$/;

/** Mirrors `SocialLink.maxCount` in the app and the constraint's array cap. */
const MAX_LINKS = 5;

export interface SocialLink {
  platform: SocialPlatform;
  handle: string;
  label: string;
  display: string;
  href: string;
}

function isPlatform(value: unknown): value is SocialPlatform {
  return typeof value === 'string' && value in SOCIAL_PLATFORMS;
}

/**
 * Turns the raw `social_links` JSON into links safe to render, dropping
 * every entry that isn't exactly `{platform, handle}` with a known platform
 * and a well-shaped handle. Never throws: a malformed value costs the
 * handles, not the page.
 */
export function parseSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const links: SocialLink[] = [];

  for (const entry of value.slice(0, MAX_LINKS)) {
    if (typeof entry !== 'object' || entry === null) continue;

    const { platform, handle } = entry as Record<string, unknown>;
    if (!isPlatform(platform)) continue;
    if (typeof handle !== 'string' || !HANDLE_SHAPE.test(handle)) continue;

    const spec = SOCIAL_PLATFORMS[platform];
    links.push({
      platform,
      handle,
      label: spec.label,
      display: spec.display(handle),
      href: spec.profileUrl(handle),
    });
  }

  return links;
}
