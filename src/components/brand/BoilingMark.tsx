'use client';

import { useEffect, useId, useState } from 'react';

import tokens from '@/../design-system/tokens.json';
import { cn } from '@/lib/utils';

/** Frame interval of the hand-drawn boil (~8fps), from tokens.json. */
const BOIL_MS = tokens.motion.duration.boil.$value;
/** Distinct frames before the loop repeats. */
const FRAMES = 6;

/**
 * The mark, "boiling": redrawn slightly differently every frame, stepped
 * and unsmoothed, like hand-drawn animation. Brand moments only (splash,
 * landing hero, the success state after verification), never routine UI.
 * Holds still under reduced motion.
 *
 * An approximation: noise displacement stands in for the 4–6 hand-drawn
 * variants of the mark the brand guide calls for. Swap the filter for those
 * frames once they exist.
 */
export function BoilingMark({ className, label = 'The human internet mark' }: { className?: string; label?: string }) {
  // useId's punctuation isn't safe inside url(#…); keep letters and digits.
  const filterId = `boil-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setFrame((f) => (f % FRAMES) + 1), BOIL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <svg viewBox="0 0 1402 1482" role="img" aria-label={label} className={cn('h-auto', className)}>
      <defs>
        <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={frame} />
          <feDisplacementMap in="SourceGraphic" scale={12} />
        </filter>
      </defs>
      <image href="/brand/mark.svg" width="1402" height="1482" filter={`url(#${filterId})`} />
    </svg>
  );
}
