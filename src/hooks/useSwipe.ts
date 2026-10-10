'use client';

import { useRef } from 'react';

import type { TouchEventHandler, WheelEventHandler } from 'react';

/** Horizontal travel, in px, below which a touch is treated as a tap. */
const SWIPE_THRESHOLD_PX = 40;

/** Sideways trackpad travel that counts as one swipe. */
const WHEEL_SWIPE_PX = 60;

/** After a trackpad swipe, ignore the rest of that gesture's momentum. */
const WHEEL_COOLDOWN_MS = 600;

export interface SwipeHandlers {
  onTouchStart: TouchEventHandler;
  onTouchEnd: TouchEventHandler;
  onWheel: WheelEventHandler;
}

/**
 * Returns handlers that fire `onSwipeLeft` / `onSwipeRight` once a
 * horizontal touch drag clears the threshold, or a sideways trackpad swipe
 * (which arrives as wheel events) travels far enough — once per gesture.
 */
export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
): SwipeHandlers {
  const startX = useRef<number | null>(null);
  const wheel = useRef({ travel: 0, until: 0 });

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
    onWheel: (event) => {
      // Vertical scrolling passes straight through.
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

      const now = performance.now();
      if (now < wheel.current.until) return;

      wheel.current.travel += event.deltaX;
      if (Math.abs(wheel.current.travel) < WHEEL_SWIPE_PX) return;

      // Fingers moving left scroll content right: positive deltaX.
      if (wheel.current.travel > 0) onSwipeLeft();
      else onSwipeRight();
      wheel.current = { travel: 0, until: now + WHEEL_COOLDOWN_MS };
    },
  };
}
