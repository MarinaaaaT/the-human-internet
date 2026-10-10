'use client';

import { useState } from 'react';

import type { ReactNode } from 'react';

import { Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DELAYS = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'];

/**
 * The brand reveal: the wordmark, then each line, faded in by opacity only
 * (`animate-reveal`, 750ms ease-out) and staggered 800ms apart. For brand
 * moments — a landing hero, a success state — not routine UI.
 */
export function BrandReveal({
  lines,
  replayable = false,
  className,
}: {
  /** Up to four short, two-beat lines: "Made by a human." */
  lines: ReactNode[];
  /** Show a "Replay reveal" button (the styleguide uses this). */
  replayable?: boolean;
  className?: string;
}) {
  // Remounting restarts the CSS animations.
  const [run, setRun] = useState(0);

  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <div key={run} className="flex flex-col items-center">
        <Wordmark className="mb-14 h-6 animate-reveal md:h-11" />
        {lines.slice(0, DELAYS.length).map((line, index) => (
          <p
            key={index}
            className={cn('text-h1 text-foreground animate-reveal md:text-display', DELAYS[index])}
          >
            {line}
          </p>
        ))}
      </div>
      {replayable ? (
        <Button variant="secondary" className="mt-8" onClick={() => setRun((n) => n + 1)}>
          Replay reveal
        </Button>
      ) : null}
    </div>
  );
}
