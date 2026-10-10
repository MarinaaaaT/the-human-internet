'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Wordmark } from '@/components/brand/Wordmark';
import { NAV_LINKS, ROUTES } from '@/content/site';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/utils';

/**
 * Scroll distance past which the bar starts to fade in, on a page with no
 * `[data-header-reveal]` element to measure instead.
 */
const REVEAL_AFTER_PX = 160;

/**
 * Scroll distance, from that point, over which the bar fades from nothing
 * to full — tracking the scroll rather than switching on at a threshold.
 */
const REVEAL_RAMP_PX = 240;

/**
 * Where the bar takes over: the bottom of the page's own
 * `[data-header-reveal]` element (the first line of the homepage hero's headline), so the
 * bar starts to appear just as that has scrolled out of view.
 */
function useRevealAfter(): number {
  const [revealAfter, setRevealAfter] = useState(REVEAL_AFTER_PX);

  useEffect(() => {
    const measure = () => {
      const el = document.querySelector('[data-header-reveal]');
      if (!el) return;
      setRevealAfter(Math.round(el.getBoundingClientRect().bottom + window.scrollY));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return revealAfter;
}

export interface SiteHeaderProps {
  /**
   * The homepage hides the bar until the hero is scrolled past. Content pages
   * have no hero to reveal it, so they pin it from the top instead.
   */
  alwaysVisible?: boolean;
}

export function SiteHeader({ alwaysVisible = false }: SiteHeaderProps) {
  const revealAfter = useRevealAfter();
  const progress = useScrollProgress(revealAfter, REVEAL_RAMP_PX);
  const opacity = alwaysVisible ? 1 : progress;
  const visible = opacity > 0;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-20',
        !visible && 'pointer-events-none',
      )}
      // Kept out of the tab order and the a11y tree while it's invisible,
      // so keyboard focus can't land on an off-screen link.
      aria-hidden={!visible}
      inert={!visible}
    >
      {/* The background and the content fade together, but as two layers:
          opacity on the header itself would cut the blur off from the page
          behind it. Opacity is the one inline style here — it's a scroll
          position, not a design value. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-background/70 backdrop-blur-md"
        style={{ opacity }}
      />
      <div
        className="mx-auto flex max-w-marketing items-center justify-between px-6 py-4 md:px-10"
        style={{ opacity }}
      >
        <Link href={ROUTES.home} className="flex min-h-touch items-center text-foreground">
          <Wordmark />
        </Link>
        <nav className="flex gap-6 text-label">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-touch items-center text-muted-foreground transition-colors duration-fast ease-out hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
