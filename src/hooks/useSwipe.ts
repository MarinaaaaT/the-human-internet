'use client';

import { useRef } from 'react';

import type { TouchEventHandler } from 'react';

/** Horizontal travel, in px, below which a touch is treated as a tap. */
const SWIPE_THRESHOLD_PX = 40;

export interface SwipeHandlers {
  onTouchStart: TouchEventHandler;
  onTouchEnd: TouchEventHandler;
}

/**
 * Returns touch handlers that fire `onSwipeLeft` / `onSwipeRight` once a
 * horizontal drag clears the threshold.
 */
export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
): SwipeHandlers {
  const startX = useRef<number | null>(null);

  return {
    onTouchStart: (event) => {
      startX.current = event.touches[0]?.clientX ?? null;
    },
    onTouchEnd: (event) => {
      const start = startX.current;
      startX.current = null;
      if (start === null) return;

      const endX = event.changedTouches[0]?.clientX;
      if (endX === undefined) return;

      const delta = endX - start;
      if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

      if (delta < 0) onSwipeLeft();
      else onSwipeRight();
    },
  };
}
