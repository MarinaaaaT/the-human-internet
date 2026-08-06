/**
 * Site-wide constants. The homepage currently has several placeholder links
 * that will point at standalone marketing pages later — they're centralised
 * here so wiring them up is a one-line edit per link rather than a hunt
 * through JSX.
 */

export const SITE_NAME = 'the human network';

/** TODO: replace with the real App Store listing once the app ships. */
export const APP_STORE_URL = '#download';

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Join', href: '#download' },
];

/** Anchor for the "how it works" section, linked from the hero copy. */
export const HOW_IT_WORKS_ANCHOR = '#how';
