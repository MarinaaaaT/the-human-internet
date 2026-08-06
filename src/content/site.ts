/**
 * Site-wide constants. Placeholder links live here so wiring them up is a
 * one-line edit rather than a hunt through JSX.
 */

export const SITE_NAME = 'the human network';

/** TODO: replace with the real App Store listing once the app ships. */
export const APP_STORE_URL = '#download';

export const ROUTES = {
  home: '/',
  about: '/about',
  verification: '/about/verification',
  identity: '/about/verification/identity',
  humanity: '/about/verification/humanity',
} as const;

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'About', href: ROUTES.about },
  // TODO: point at a real signup destination.
  { label: 'Join', href: '#download' },
];

/** Anchor for the "how it works" section, linked from the hero copy. */
export const HOW_IT_WORKS_ANCHOR = '#how';

/**
 * External destinations referenced by the About copy that don't exist yet.
 * A `null` renders as plain text instead of a link, so nothing ships as a
 * broken URL — fill these in to turn them into real links automatically.
 */
export const EXTERNAL_LINKS: Record<string, string | null> = {
  donate: null,
  roadmap: null,
  discord: null,
  introVideo: null,
};

export const CONTENT_AUTHENTICITY_URL = 'https://contentauthenticity.org/';
