'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { KeyboardEvent } from 'react';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { HOW_IT_WORKS_STEPS } from '@/content/steps';
import { useSwipe } from '@/hooks/useSwipe';
import { cn } from '@/lib/utils';

const STEP_COUNT = HOW_IT_WORKS_STEPS.length;
const AUTO_ADVANCE_MS = 6000;

const panelId = (index: number) => `how-it-works-panel-${index}`;
const tabId = (index: number) => `how-it-works-tab-${index}`;

export interface HowItWorksProps {
  /** Cycle through the steps on a timer until the visitor interacts. */
  autoAdvance?: boolean;
}

export function HowItWorks({ autoAdvance = false }: HowItWorksProps) {
  const [active, setActive] = useState(0);
  // Any manual selection cancels auto-advance for the rest of the session.
  const [interacted, setInteracted] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  /** Arrow-key navigation, per the WAI-ARIA tabs pattern. */
  const onTabKeyDown = (event: KeyboardEvent) => {
    const delta =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (delta === 0) return;

    event.preventDefault();
    const target = (((active + delta) % STEP_COUNT) + STEP_COUNT) % STEP_COUNT;
    select(target);
    tabRefs.current[target]?.focus();
  };

  // One step at a time on mobile; all three columns from md up.
  const onlyActiveOnMobile = (index: number) =>
    index === active ? undefined : 'max-md:hidden';

  return (
    <section className="bg-background text-foreground" id="how">
      <div className="mx-auto max-w-marketing px-6 pt-16 pb-32 md:px-10 md:pt-24 md:pb-24">
        <div
          className="mb-12 grid grid-cols-1 items-end justify-items-center gap-6 md:mb-24 md:grid-cols-3"
          {...swipeHandlers}
        >
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <button
              key={step.ordinal}
              className={cn('flex items-end justify-center', onlyActiveOnMobile(index))}
              onClick={() => select(index)}
              aria-label={`Show step ${index + 1}`}
              aria-controls={panelId(index)}
            >
              <Image
                className={cn(
                  'h-96 w-auto max-w-full object-contain transition-opacity duration-base ease-out',
                  index === active ? 'opacity-100' : 'opacity-40',
                )}
                src={step.image}
                alt={step.imageAlt}
                sizes="(max-width: 768px) 90vw, 33vw"
              />
            </button>
          ))}
        </div>

        <p className="mb-8 text-label text-muted-foreground">How it works</p>

        <div
          className="grid grid-cols-1 gap-10 border-t border-border md:grid-cols-3"
          role="tablist"
          aria-label="How it works"
        >
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <button
              key={step.ordinal}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              className={cn('flex flex-col pt-0 text-left', onlyActiveOnMobile(index))}
              role="tab"
              id={tabId(index)}
              aria-selected={index === active}
              aria-controls={panelId(index)}
              tabIndex={index === active ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={onTabKeyDown}
            >
              <span
                className={cn(
                  '-mt-px mb-5 h-0.5 bg-foreground transition-opacity duration-base ease-out',
                  index === active ? 'opacity-100' : 'opacity-0',
                )}
              />
              <span className="mb-1 text-caption text-muted-foreground">{step.ordinal}</span>
              <span
                className={cn(
                  'text-title transition-colors duration-base ease-out',
                  index === active ? 'text-foreground' : 'text-subtle-foreground',
                )}
              >
                {step.title}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-10 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div
              key={step.ordinal}
              className={onlyActiveOnMobile(index)}
              role="tabpanel"
              id={panelId(index)}
              aria-labelledby={tabId(index)}
              // Deliberately not `hidden`: on desktop the inactive cell must
              // keep its grid column so the three columns stay aligned with
              // the tabs above. The inner body is display:none instead,
              // which also takes it out of the accessibility tree.
            >
              <div
                className={cn(
                  'flex-col items-start gap-6',
                  index === active ? 'flex animate-fade-in' : 'hidden',
                )}
              >
                <p className="text-body text-muted-foreground text-pretty">{step.body}</p>
                {step.ctaHref ? (
                  <Button asChild variant="secondary">
                    <Link href={step.ctaHref}>{step.cta}</Link>
                  </Button>
                ) : (
                  <Button variant="secondary">{step.cta}</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center gap-3 md:hidden">
        <Button
          size="icon"
          variant="secondary"
          className="pointer-events-auto"
          onClick={previous}
          aria-label="Previous step"
        >
          <ArrowLeft strokeWidth={1.5} />
        </Button>
        <span
          className="flex items-center rounded-full bg-surface px-5 text-label text-foreground"
          aria-hidden="true"
        >
          {active + 1} / {STEP_COUNT}
        </span>
        <Button
          size="icon"
          variant="secondary"
          className="pointer-events-auto"
          onClick={next}
          aria-label="Next step"
        >
          <ArrowRight strokeWidth={1.5} />
        </Button>
      </div>
    </section>
  );
}
