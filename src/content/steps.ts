import { Camera, Link2, UserRound } from 'lucide-react';

import { ROUTES, SECTION_LINKS } from '@/content/site';

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
    screenAlt: 'Human verification screen',
    placeholderIcon: UserRound,
  },
  {
    ordinal: '02',
    title: 'Take real photos',
    body: 'Take photos in our app. We’ll handle verifying them behind the scenes.',
    cta: 'How do you do it?',
    ctaHref: ROUTES.verification,
    screenAlt: 'Photo capture screen',
    placeholderIcon: Camera,
  },
  {
    ordinal: '03',
    title: 'Share photos with proof',
    body: 'You put work into your photos. Show it by sharing a human link alongside your photos.',
    // TODO: point at the example verification page once it exists.
    cta: 'See what it looks like',
    screenAlt: 'Share and verified link screen',
    placeholderIcon: Link2,
  },
];
