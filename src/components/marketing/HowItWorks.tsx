'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { KeyboardEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { HOW_IT_WORKS_STEPS } from '@/content/steps';
import { useSwipe } from '@/hooks/useSwipe';

import styles from './HowItWorks.module.css';

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

  return (
    <section className={styles.section} id="how">
      <div className={styles.inner}>
        <div
          className={`${styles.columns} ${styles.phones}`}
          {...swipeHandlers}
        >
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <button
              key={step.ordinal}
              className={styles.phoneButton}
              data-active={index === active}
              onClick={() => select(index)}
              aria-label={`show step ${index + 1}`}
              aria-controls={panelId(index)}
            >
              <Image
                className={styles.phoneImage}
                src={step.image}
                alt={step.imageAlt}
                sizes="(max-width: 760px) 90vw, 33vw"
              />
            </button>
          ))}
        </div>

        <p className={styles.kicker}>how it works</p>

        <div
          className={`${styles.columns} ${styles.tabs}`}
          role="tablist"
          aria-label="how it works"
        >
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <button
              key={step.ordinal}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              className={styles.tab}
              data-active={index === active}
              role="tab"
              id={tabId(index)}
              aria-selected={index === active}
              aria-controls={panelId(index)}
              tabIndex={index === active ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={onTabKeyDown}
            >
              <span className={styles.tabRule} />
              <span className={styles.tabOrdinal}>{step.ordinal}</span>
              <span className={styles.tabTitle}>{step.title}</span>
            </button>
          ))}
        </div>

        <div className={`${styles.columns} ${styles.panels}`}>
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div
              key={step.ordinal}
              className={styles.panel}
              data-active={index === active}
              role="tabpanel"
              id={panelId(index)}
              aria-labelledby={tabId(index)}
              // Deliberately not `hidden`: on desktop the inactive cell must
              // keep its grid column so the three columns stay aligned with
              // the tabs above. The inner .panelBody is display:none instead,
              // which also takes it out of the accessibility tree.
            >
              <div className={styles.panelBody}>
                <p className={styles.panelText}>{step.body}</p>
                <Button variant="glass" size="md">
                  {step.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.mobileNav}>
        <button
          className={styles.navButton}
          onClick={previous}
          aria-label="previous step"
        >
          ←
        </button>
        <span className={styles.navCounter} aria-hidden="true">
          {active + 1} / {STEP_COUNT}
        </span>
        <button
          className={styles.navButton}
          onClick={next}
          aria-label="next step"
        >
          →
        </button>
      </div>
    </section>
  );
}
