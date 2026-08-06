import stepIdentity from '@/../public/images/step-1-identity.png';
import stepCapture from '@/../public/images/step-2-capture.png';
import stepShare from '@/../public/images/step-3-share.png';

import type { StaticImageData } from 'next/image';

export interface HowItWorksStep {
  /** Display number, e.g. "01". */
  ordinal: string;
  title: string;
  body: string;
  /** Label on the step's call-to-action button. */
  cta: string;
  image: StaticImageData;
  imageAlt: string;
}

/**
 * Copy for the "how it works" section. Kept out of the component so marketing
 * wording can be edited without touching layout code.
 */
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    ordinal: '01',
    title: 'verify your identity',
    body: 'Confirm that you’re a real person through a secure identity verification process.',
    cta: 'what do i need to do?',
    image: stepIdentity,
    imageAlt: 'identity verification screen',
  },
  {
    ordinal: '02',
    title: 'take human photos',
    body: 'Capture a photo in the app. Behind the scenes, we verify that it was taken by a real person using a real camera, then generate a link you can use as proof.',
    cta: 'what makes it human?',
    image: stepCapture,
    imageAlt: 'photo capture screen',
  },
  {
    ordinal: '03',
    title: 'share verified photos',
    body: 'Copy the verification link or share the photo directly to your favorite social platforms so others can see that it came from a real human.',
    cta: 'see what it looks like',
    image: stepShare,
    imageAlt: 'share and verified link screen',
  },
];
