/**
 * Site-wide constants. Placeholder links live here so wiring them up is a
 * one-line edit rather than a hunt through JSX.
 */

export const SITE_NAME = 'the human internet';

/** The app's App Store listing — every download link on the site points here. */
export const APP_STORE_URL =
  'https://apps.apple.com/us/app/the-human-internet/id6804428894';

/**
 * The app's custom-scheme link to a photo; the UUID follows. Must match
 * `VerifiedPhoto.deepLinkScheme`/`deepLinkHost` in the app.
 */
export const APP_PHOTO_DEEP_LINK_PREFIX = 'thehumaninternet://photo/';

export const ROUTES = {
  home: '/',
  about: '/about',
  verification: '/about/verification',
  privacyPolicy: '/about/privacy-policy',
} as const;

/**
 * The two halves of verification live as sections on the verification page
 * rather than as their own routes, so they're linked by anchor. The ids are
 * declared here so the links and the headings can't drift apart.
 */
export const VERIFICATION_SECTIONS = {
  identity: 'identity',
  humanity: 'humanity',
  privacy: 'privacy',
} as const;

export const SECTION_LINKS = {
  identity: `${ROUTES.verification}#${VERIFICATION_SECTIONS.identity}`,
  humanity: `${ROUTES.verification}#${VERIFICATION_SECTIONS.humanity}`,
  privacy: `${ROUTES.verification}#${VERIFICATION_SECTIONS.privacy}`,
} as const;

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'About', href: ROUTES.about },
  { label: 'Join', href: APP_STORE_URL },
];

/**
 * A real verification page shown as the example of what a share looks like
 * (the last "how it works" step). A path, not the full URL, so it resolves on
 * preview deployments too — it's the same `/[photoId]` route either way.
 */
export const EXAMPLE_VERIFICATION_PATH = '/FzHYzuDD';

/** Anchor for the "how it works" section, linked from the hero copy. */
export const HOW_IT_WORKS_ANCHOR = '#how';

/**
 * External destinations referenced by the About copy that don't exist yet.
 * A `null` renders as plain text instead of a link, so nothing ships as a
 * broken URL — fill these in to turn them into real links automatically.
 */
export const EXTERNAL_LINKS: Record<string, string | null> = {
  roadmap: 'https://thehumaninternet.featurebase.app/roadmap',
  discord: 'https://discord.gg/G6aAgEq2sU',
  feedback: 'https://thehumaninternet.featurebase.app/',
  introVideo: null,
};

export const STRIPE_PRIVACY_URL = 'https://stripe.com/privacy';
export const STRIPE_PRIVACY_EMAIL = 'privacy@stripe.com';

export const CONTENT_AUTHENTICITY_URL = 'https://contentauthenticity.org/';
export const APP_ATTEST_URL =
  'https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity';
export const FACE_ID_URL =
  'https://support.apple.com/guide/security/biometric-security-sec067eb0c9e/web';
