'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

import { Plus } from 'lucide-react';

import { ProofCard } from '@/components/brand/ProofCard';
import { VerifiedMark } from '@/components/brand/VerifiedMark';
import { AppleLogo } from '@/components/icons/AppleLogo';
import { Button } from '@/components/ui/button';
import { APP_STORE_URL, ROUTES } from '@/content/site';
import { cn } from '@/lib/utils';

import candle from '@/../public/images/hero/candle.jpg';
import phone from '@/../public/images/hero/phone.jpg';
import tile from '@/../public/images/hero/tile.jpg';

/** How long the demo holds each state, matching the brand scroller. */
const DEMO_STEP_MS = 3000;

interface HeroCard {
  image: StaticImageData;
  alt: string;
  device: string;
  date: string;
  time: string;
  os: string;
  place: string;
  coords: string;
  className: string;
}

// Example capture details for the illustration — not real photo metadata.
const CARDS: HeroCard[] = [
  {
    image: candle,
    alt: 'A lit candle on a wooden stool',
    device: 'iPhone 15 Pro',
    date: 'August 2, 2026',
    time: '9:18 AM',
    os: 'iOS 19.0',
    place: 'Brooklyn, NY',
    coords: '40.6782° N, 73.9442° W',
    // Behind the centre card, a little smaller and lower, tilted out.
    className: 'top-1/10 left-0 w-8/25 -rotate-14',
  },
  {
    image: phone,
    alt: 'A phone showing a selfie, lying on stone',
    device: 'iPhone 16',
    date: 'September 4, 2026',
    time: '6:05 PM',
    os: 'iOS 19.0',
    place: 'Los Angeles, CA',
    coords: '34.0522° N, 118.2437° W',
    className: 'top-0 left-8/25 z-10 w-9/25',
  },
  {
    image: tile,
    alt: 'A blue painted tile held up to the camera',
    device: 'iPhone 16 Pro Max',
    date: 'September 18, 2026',
    time: '3:42 PM',
    os: 'iOS 19.0.1',
    place: 'San Francisco, CA',
    coords: '37.7749° N, 122.4194° W',
    className: 'top-1/10 right-0 w-8/25 rotate-14',
  },
];

/** The card the demo reveals on its own: the last one, as in the scroller. */
const DEMO_CARD = CARDS.length - 1;

function Reveal({ card }: { card: HeroCard }): ReactNode {
  return (
    <div className="flex flex-col gap-0.5 text-caption md:text-body lg:text-title">
      <VerifiedMark className="absolute top-4 right-4 h-5 md:top-6 md:right-6 md:h-7" />
      <span>{card.device}</span>
      <span>
        {card.date} <span className="text-caption text-muted-foreground">{card.time}</span>
      </span>
      <span>{card.os}</span>
      <span>
        {card.place}{' '}
        <span className="hidden text-caption text-muted-foreground md:inline">{card.coords}</span>
      </span>
    </div>
  );
}

/**
 * The hero's fan of verified photos. Each card is a ProofCard, so hover or
 * tap shows its proof; until someone does, the right-hand card demonstrates
 * the reveal on its own, the way the brand scroller does.
 */
export function HeroCards({ className }: { className?: string }) {
  const [demoOn, setDemoOn] = useState(false);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    if (interacting) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setDemoOn((on) => !on), DEMO_STEP_MS);
    return () => window.clearInterval(id);
  }, [interacting]);

  return (
    <div
      // `hero-fan` (globals.css) sizes this box to fit the space it's given;
      // the cards are placed in percentages of it, so the whole fan scales
      // as one. 20:9 is the centre card's height (36% wide × 5/4).
      className={cn('hero-fan aspect-20/9 max-sm:hero-fan-bleed', className)}
      onPointerEnter={() => {
        setInteracting(true);
        setDemoOn(false);
      }}
      onPointerLeave={() => setInteracting(false)}
      onFocus={() => {
        setInteracting(true);
        setDemoOn(false);
      }}
      onBlur={() => setInteracting(false)}
    >
      {CARDS.map((card, index) => (
        <ProofCard
          key={card.alt}
          className={cn('absolute', card.className)}
          src={card.image.src}
          width={card.image.width}
          height={card.image.height}
          alt={card.alt}
          fit="portrait"
          sizes="(min-width: 768px) 440px, 40vw"
          priority
          revealed={index === DEMO_CARD && demoOn}
          reveal={<Reveal card={card} />}
        />
      ))}

      {/* The app's CTA, set on the phone screen in the centre card (57% of
          the way down it, centred). A sibling of the cards rather than
          inside one: each card is itself a button, and links can't nest
          in it. Type and controls keep their token sizes rather than
          scaling with the photo, so they stay legible and tappable. */}
      <div className="absolute top-57/100 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {/* Styled to the mockup rather than the stock buttons: a squared-off
            badge, not a pill, light grey type, and a heavier plus. */}
        <Button
          asChild
          variant="secondary"
          className="h-10 gap-1.5 rounded-sm bg-surface-hover px-3 hover:bg-surface"
        >
          <a href={APP_STORE_URL} aria-label="Download on the App Store">
            {/* Optical centring: the apple's weight is its body, below its
                leaf, so it reads low beside the text even when their boxes
                are centred. A pixel each way evens them up. */}
            <AppleLogo className="size-7 -translate-y-px text-subtle-foreground" />
            <span className="flex translate-y-px flex-col text-left text-badge text-subtle-foreground">
              <span>Download on</span>
              <span>the App Store</span>
            </span>
          </a>
        </Button>
        <Button
          asChild
          variant="secondary"
          size="icon"
          className="size-10 bg-surface-hover text-muted-foreground hover:bg-surface"
        >
          <Link href={ROUTES.about} aria-label="About the human internet">
            <Plus strokeWidth={4.5} className="size-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
