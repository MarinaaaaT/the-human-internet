'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { HOW_IT_WORKS_STEPS } from '@/content/steps';
import { useSwipe } from '@/hooks/useSwipe';
import { cn } from '@/lib/utils';

const STEP_COUNT = HOW_IT_WORKS_STEPS.length;
const AUTO_ADVANCE_MS = 6000;

export interface HowItWorksProps {
  /** Cycle through the steps on a timer until the visitor interacts. */
  autoAdvance?: boolean;
}

export function HowItWorks({ autoAdvance = false }: HowItWorksProps) {
  const [active, setActive] = useState(0);
  // Any manual selection cancels auto-advance for the rest of the session.
  const [interacted, setInteracted] = useState(false);

  const select = useCallback((index: number) => {
    setInteracted(true);
    setActive(((index % STEP_COUNT) + STEP_COUNT) % STEP_COUNT);
  }, []);

  const next = useCallback(() => select(active + 1), [active, select]);
  const previous = useCallback(() => select(active - 1), [active, select]);

  useEffect(() => {
    if (!autoAdvance || interacted) return;

    const timer = window.setInterval(
      () => setActive((step) => (step + 1) % STEP_COUNT),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(timer);
  }, [autoAdvance, interacted]);

  const swipeHandlers = useSwipe(next, previous);

  return (
    <section
      className="bg-background text-foreground"
      id="how"
      aria-roledescription="carousel"
      aria-labelledby="how-it-works-heading"
    >
      {/* Swipes (touch, or sideways on a trackpad) anywhere in the section
          move to the next or previous step. `touch-pan-y` keeps vertical
          scrolling native. The phone and its pager sit above the steps on
          mobile, beside them from md up. */}
      <div
        className="mx-auto max-w-marketing touch-pan-y px-6 py-16 md:grid md:grid-cols-2 md:items-center md:gap-16 md:px-10 md:py-24"
        {...swipeHandlers}
      >
        <div className="mb-12 flex flex-col items-center gap-6 md:mb-0">
          <PhonePreview active={active} />
          <Pager active={active} onPrevious={previous} onNext={next} />
        </div>

        <div className="md:max-w-md">
          <h2 id="how-it-works-heading" className="mb-8 text-label text-muted-foreground">
            How it works
          </h2>
          <span className="mb-5 block h-0.5 bg-foreground" aria-hidden="true" />

          {/* Every step sits in the same grid cell, so the column is as tall
              as the longest one and doesn't jump as the copy changes. The
              inactive ones are `invisible`, which also takes them out of the
              tab order and the accessibility tree. */}
          <div className="grid" aria-live={autoAdvance && !interacted ? 'off' : 'polite'}>
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div
                key={step.ordinal}
                className={cn(
                  'col-start-1 row-start-1 flex flex-col items-start',
                  index === active ? 'animate-fade-in' : 'invisible',
                )}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${STEP_COUNT}`}
              >
                <span className="mb-1 text-caption text-muted-foreground">{step.ordinal}</span>
                <h3 className="text-title">{step.title}</h3>
                <p className="mt-6 text-body text-muted-foreground text-pretty">{step.body}</p>
                {step.ctaHref ? (
                  <Button asChild variant="secondary" className="mt-6">
                    <Link href={step.ctaHref}>{step.cta}</Link>
                  </Button>
                ) : (
                  <Button variant="secondary" className="mt-6">
                    {step.cta}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A front-facing phone showing the active step's screen. The frame is drawn
 * here rather than baked into the artwork, so each step only supplies what's
 * on the screen.
 */
function PhonePreview({ active }: { active: number }) {
  return (
    <div className="relative aspect-9/19 w-40 overflow-hidden rounded-xl border-4 border-foreground bg-surface md:w-64 md:rounded-2xl">
      {HOW_IT_WORKS_STEPS.map((step, index) => {
        const Placeholder = step.placeholderIcon;
        return (
          <div
            key={step.ordinal}
            className={cn(
              'absolute inset-0 transition-opacity duration-base ease-out',
              index === active ? 'opacity-100' : 'opacity-0',
            )}
            aria-hidden={index !== active}
          >
            {step.screen ? (
              <Image
                className="object-cover"
                src={step.screen}
                alt={step.screenAlt}
                fill
                sizes="(max-width: 768px) 10rem, 16rem"
              />
            ) : (
              <div
                className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-muted-foreground"
                role="img"
                aria-label={step.screenAlt}
              >
                <Placeholder className="size-12" strokeWidth={1.5} />
                <span className="text-label">{step.title}</span>
              </div>
            )}
          </div>
        );
      })}
      {/* The Dynamic Island. */}
      <span
        className="absolute inset-x-0 top-2 mx-auto h-4 w-12 rounded-full bg-foreground md:top-3 md:h-6 md:w-20"
        aria-hidden="true"
      />
    </div>
  );
}

function Pager({
  active,
  onPrevious,
  onNext,
}: {
  active: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex justify-center gap-3">
      <Button size="icon" variant="secondary" onClick={onPrevious} aria-label="Previous step">
        <ArrowLeft strokeWidth={1.5} />
      </Button>
      <span
        className="flex items-center rounded-full bg-surface px-5 text-label text-foreground"
        aria-hidden="true"
      >
        {active + 1} / {STEP_COUNT}
      </span>
      <Button size="icon" variant="secondary" onClick={onNext} aria-label="Next step">
        <ArrowRight strokeWidth={1.5} />
      </Button>
    </div>
  );
}
