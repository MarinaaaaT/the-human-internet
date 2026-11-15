'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { VerifiedMark } from '@/components/brand/VerifiedMark';
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
 * What a clip's beat clock says should be showing at this moment of a pass:
 * the face bracket, the proof card, the spiral on it. A bit set, so React
 * can skip the many frames where nothing changes.
 */
const BEAT_BRACKETS = 1;
const BEAT_CARD = 2;
const BEAT_MARK = 4;

/**
 * A front-facing phone showing the active step's screen. The frame is drawn
 * here rather than baked into the artwork, so each step only supplies what's
 * on the screen. A step's `proof` card sits outside the frame, over its
 * lower-left corner, so the wrapper doesn't clip.
 */
function PhonePreview({ active }: { active: number }) {
  // Nothing moves until the phone has been fully on screen once: the clips
  // sit on their first frame and the proof card stays hidden, so the
  // sequence starts where the visitor can see it from the top.
  const phone = useRef<HTMLDivElement>(null);
  const started = useSeenInFull(phone);
  // The proof card follows the clock of its own step's clip.
  const [proofBeats, setProofBeats] = useState(0);

  return (
    <div className="relative">
      <div
        ref={phone}
        className="relative aspect-9/19 w-40 overflow-hidden rounded-xl border-4 border-foreground bg-surface md:w-64 md:rounded-2xl"
      >
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
              {step.screenVideo ? (
                <ScreenVideo
                  {...step.screenVideo}
                  label={step.screenAlt}
                  playing={started && index === active}
                  onBeats={step.proof ? setProofBeats : undefined}
                />
              ) : step.screen ? (
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

      {HOW_IT_WORKS_STEPS.map((step, index) => {
        if (!step.proof) return null;
        const live = started && index === active;
        return (
          <StepProof
            key={step.ordinal}
            {...step.proof}
            card={live && (proofBeats & BEAT_CARD) !== 0}
            mark={live && (proofBeats & BEAT_MARK) !== 0}
          />
        );
      })}
    </div>
  );
}

/**
 * A looping, muted clip on the phone's screen. It plays only while its step
 * is showing, and never for a visitor who prefers reduced motion: they get
 * the poster, the clip's first frame.
 *
 * A clip with a face bracket or a proof card (`onBeats`) also keeps time
 * for them, from its own clock, so they replay on every pass and stay in
 * step with the picture:
 *
 * - the bracket from the top until it has faded out (one `duration-base`)
 *   at two staggers;
 * - the proof card from one stagger, the spiral from two;
 * - both gone (faded by one `duration-base`) just before the pass ends.
 *
 * The timings are read from the tokens, not restated. With reduced motion
 * nothing loops: the card and spiral simply show, and the bracket never does.
 */
function ScreenVideo({
  src,
  poster,
  faceFrame,
  label,
  playing,
  onBeats,
}: {
  src: string;
  poster: string;
  faceFrame?: string;
  label: string;
  playing: boolean;
  onBeats?: (beats: number) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [clockBeats, setClockBeats] = useState(0);
  const keepsTime = Boolean(faceFrame || onBeats);
  const beats = !playing ? 0 : reducedMotion ? BEAT_CARD | BEAT_MARK : clockBeats;

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (playing && !reducedMotion) {
      // From the top each time the step comes back, so the beats and the
      // clip start together. Autoplay of a muted clip is allowed everywhere
      // we care about; if a browser refuses anyway, the poster stays up.
      element.currentTime = 0;
      element.play().catch(() => {});
    } else {
      element.pause();
    }
  }, [playing, reducedMotion]);

  useEffect(() => {
    const element = video.current;
    if (!element || !keepsTime || !playing || reducedMotion) return;
    const style = getComputedStyle(document.documentElement);
    // Browsers may serialise these as seconds (`.8s`) rather than as
    // written (`800ms`), so honour either unit. Returned in seconds.
    const seconds = (name: string) => {
      const value = style.getPropertyValue(name).trim();
      const number = parseFloat(value) || 0;
      return value.endsWith('ms') ? number / 1000 : number;
    };
    const stagger = seconds('--ds-duration-stagger');
    const base = seconds('--ds-duration-base');
    const update = () => {
      const time = element.currentTime;
      // A tenth of a second of slack so the fade-out finishes before the
      // loop even when the clock is only read a few times a second.
      const passEnd = Number.isFinite(element.duration)
        ? element.duration - base - 0.1
        : Number.POSITIVE_INFINITY;
      let next = 0;
      if (faceFrame && time < 2 * stagger - base) next |= BEAT_BRACKETS;
      if (time >= stagger && time < passEnd) next |= BEAT_CARD;
      if (time >= 2 * stagger && time < passEnd) next |= BEAT_MARK;
      setClockBeats(next);
    };
    // Every frame for precision while the page is on screen; `timeupdate`
    // (a few times a second) as well, since frames stop in a background or
    // throttled tab while the clip can keep playing.
    let frame = 0;
    const tick = () => {
      update();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    element.addEventListener('timeupdate', update);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('timeupdate', update);
    };
  }, [faceFrame, keepsTime, playing, reducedMotion]);

  useEffect(() => {
    onBeats?.(beats);
  }, [onBeats, beats]);

  return (
    <div className="absolute inset-0" role="img" aria-label={label}>
      <video
        ref={video}
        className="size-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      {faceFrame ? (
        <FaceFrame className={faceFrame} visible={(beats & BEAT_BRACKETS) !== 0} />
      ) : null}
    </div>
  );
}

/**
 * Corner brackets around the face, like a camera that has found one. On
 * each pass of the clip they fade in, hold, and fade out on the beat the
 * spiral appears on the ID card: checked, then verified. `ScreenVideo`
 * decides when. Opacity only — no green "success" state, since the palette
 * has no green.
 */
function FaceFrame({ className, visible }: { className: string; visible: boolean }) {
  return (
    <div
      className={cn(
        'absolute transition-opacity duration-base ease-out',
        visible ? 'opacity-100' : 'opacity-0',
        className,
      )}
      aria-hidden="true"
    >
      <Brackets />
    </div>
  );
}

function Brackets() {
  const corner = 'absolute size-6 border-background md:size-8';
  return (
    <div className="absolute inset-0">
      <span className={cn(corner, 'top-0 left-0 rounded-tl-md border-t-2 border-l-2 md:border-t-3 md:border-l-3')} />
      <span className={cn(corner, 'top-0 right-0 rounded-tr-md border-t-2 border-r-2 md:border-t-3 md:border-r-3')} />
      <span className={cn(corner, 'bottom-0 left-0 rounded-bl-md border-b-2 border-l-2 md:border-b-3 md:border-l-3')} />
      <span className={cn(corner, 'right-0 bottom-0 rounded-br-md border-r-2 border-b-2 md:border-r-3 md:border-b-3')} />
    </div>
  );
}

/**
 * The card a step's screen is checked against, over the phone's lower-left
 * corner, and the spiral on its corner. Each fades in slowly when its beat
 * comes (`card`, `mark`) and out quickly when it goes, so both are gone
 * before the clip loops and comes round to them again.
 *
 * The white border is the gap between the card and the phone behind it:
 * this is a picture of a physical card, not a UI card, and a shadow would
 * break the flat-surface rule.
 */
function StepProof({
  src,
  alt,
  width,
  height,
  card,
  mark,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  card: boolean;
  mark: boolean;
}) {
  return (
    <div
      className={cn(
        'absolute bottom-10 -left-8 w-20 transition-opacity ease-out md:bottom-16 md:-left-12 md:w-32',
        card ? 'opacity-100 duration-slow' : 'opacity-0 duration-base',
      )}
      aria-hidden={!card}
    >
      <div className="relative">
        <Image
          className="block h-auto w-full rounded-sm border-2 border-background"
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 5rem, 8rem"
        />
        <VerifiedMark
          variant="badge"
          label="Verified"
          className={cn(
            'absolute -top-4 -right-4 transition-opacity ease-out',
            mark ? 'opacity-100 duration-slow' : 'opacity-0 duration-base',
          )}
        />
      </div>
    </div>
  );
}

/**
 * True from the first time the element is entirely on screen, and stays
 * true. "Entirely" allows for a window too short to hold it: then filling
 * nearly all of the viewport counts.
 */
function useSeenInFull(element: RefObject<HTMLElement | null>) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const target = element.current;
    if (!target || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const viewport = entry.rootBounds?.height ?? window.innerHeight;
        const whole =
          entry.intersectionRatio >= 0.99 || entry.intersectionRect.height >= viewport * 0.95;
        if (entry.isIntersecting && whole) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 1] },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [element, seen]);
  return seen;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
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
