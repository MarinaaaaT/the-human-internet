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
} as const;

/**
 * The two halves of verification live as sections on the verification page
 * rather than as their own routes, so they're linked by anchor. The ids are
 * declared here so the links and the headings can't drift apart.
 */
export const VERIFICATION_SECTIONS = {
  identity: 'identity',
  humanity: 'humanity',
} as const;

export const SECTION_LINKS = {
  identity: `${ROUTES.verification}#${VERIFICATION_SECTIONS.identity}`,
  humanity: `${ROUTES.verification}#${VERIFICATION_SECTIONS.humanity}`,
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
