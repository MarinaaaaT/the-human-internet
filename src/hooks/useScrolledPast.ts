'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether the page has been scrolled past `threshold` pixels.
 *
 * Reads are batched into a rAF so a fast scroll can't queue up a render per
 * scroll event, and state only changes when the boolean actually flips.
 */
export function useScrolledPast(threshold: number): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const el = document.scrollingElement ?? document.documentElement;
      setScrolled((window.scrollY || el.scrollTop || 0) > threshold);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
