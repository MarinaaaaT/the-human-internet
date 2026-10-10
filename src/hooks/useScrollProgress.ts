'use client';

import { useEffect, useState } from 'react';

/**
 * How far the page has been scrolled through the `distance` pixels after
 * `start`, from 0 (at or above `start`) to 1 (at `start + distance` or
 * beyond).
 *
 * Batched into a rAF like `useScrolledPast`, and rounded to hundredths so a
 * slow scroll doesn't render for every sub-pixel change.
 */
export function useScrollProgress(start: number, distance: number): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const el = document.scrollingElement ?? document.documentElement;
      const scrolled = window.scrollY || el.scrollTop || 0;
      setProgress(Math.round(Math.min(1, Math.max(0, (scrolled - start) / distance)) * 100) / 100);
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
  }, [start, distance]);

  return progress;
}
