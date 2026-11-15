import { Camera, Link2, UserRound } from 'lucide-react';

import { EXAMPLE_VERIFICATION_PATH, ROUTES, SECTION_LINKS } from '@/content/site';

import type { LucideIcon } from 'lucide-react';
import type { StaticImageData } from 'next/image';

export interface HowItWorksStep {
  /** Display number, e.g. "01". */
  ordinal: string;
  title: string;
  body: string;
  /** Label on the step's call-to-action button. */
  cta: string;
  /**
   * Where the CTA goes. Omit while a step has no destination yet — the button
   * then renders inert rather than linking nowhere.
   */
  ctaHref?: string;
  /**
   * What the phone shows for this step: a screenshot of the app, cropped to
   * the screen (no frame — the section draws the phone around it). Omit
   * while there isn't one yet; the phone then shows `placeholderIcon`.
   */
  screen?: StaticImageData;
  /**
   * A looping, muted clip for the screen instead of `screen` (a path under
   * `public/`). `poster` is its first frame: what shows before it plays,
   * and all that shows to a visitor who prefers reduced motion.
   */
  screenVideo?: {
    src: string;
    poster: string;
    /**
     * Inset classes placing a corner bracket around the face, the way a
     * camera marks what it has found. Fractions of the phone's screen, so
     * they're tied to this clip's framing. Omit for no bracket.
     */
    faceFrame?: string;
  };
  /**
   * A card that fades in over the phone's lower-left corner once the step
   * is showing, followed by the verified spiral on its corner: the thing
   * the screen is being checked against.
   */
  proof?: { src: string; alt: string; width: number; height: number };
  screenAlt: string;
  placeholderIcon: LucideIcon;
}

/**
 * Copy for the "how it works" section. Kept out of the component so marketing
 * wording can be edited without touching layout code.
 */
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    ordinal: '01',
    title: 'Prove you’re human',
    body: 'You’re not a bot. Prove you’re real and optionally prove who you are.',
    cta: 'What do I need to do?',
    ctaHref: SECTION_LINKS.humanity,
    screenVideo: {
      src: '/images/how-it-works/selfie.mp4',
      poster: '/images/how-it-works/selfie-poster.jpg',
      faceFrame: 'inset-x-1/5 top-1/5 bottom-2/5',
    },
    // A sample licence, not a real document: made-up name, number and
    // address around the same face as the selfie.
    proof: {
      src: '/images/how-it-works/sample-id.webp',
      alt: 'A sample driver’s license with the same face',
      width: 1582,
      height: 994,
    },
    screenAlt: 'A selfie video of the person proving they’re human',
    placeholderIcon: UserRound,
  },
  {
    ordinal: '02',
    title: 'Take real photos',
    body: 'Take photos in our app. We’ll handle verifying them behind the scenes.',
    cta: 'How do you do it?',
    ctaHref: ROUTES.verification,
    // A screen recording of the app at normal speed: the camera, the shot,
    // then the verified photo ready to share.
    screenVideo: {
      src: '/images/how-it-works/capture.mp4',
      poster: '/images/how-it-works/capture-poster.jpg',
    },
    screenAlt: 'The app’s camera taking a photo of a cat, then showing it verified and ready to share',
    placeholderIcon: Camera,
  },
  {
    ordinal: '03',
    title: 'Share photos with proof',
    body: 'You put work into your photos. Show it by sharing a human link alongside your photos.',
    cta: 'See what it looks like',
    ctaHref: EXAMPLE_VERIFICATION_PATH,
    // A screen recording from the verified photo: shared to X with its
    // link, then (from the profile on) the link opened to the verification
    // page. 2x up to the side menu, which is cut out, then normal speed.
    screenVideo: {
      src: '/images/how-it-works/share.mp4',
      poster: '/images/how-it-works/share-poster.jpg',
    },
    screenAlt: 'Sharing the verified photo to X with its link, then opening the link to its verification page',
    placeholderIcon: Link2,
  },
];
