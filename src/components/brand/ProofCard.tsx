'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { ReactNode } from 'react';

import { VerifiedMark } from '@/components/brand/VerifiedMark';
import { cn } from '@/lib/utils';

export interface ProofCardProps {
  src: string;
  alt: string;
  /** Intrinsic size, for layout before the image loads. */
  width: number;
  height: number;
  sizes?: string;
  /** Short-lived signed URLs can't go through the image optimiser. */
  unoptimized?: boolean;
  priority?: boolean;
  /**
   * `natural` keeps the photo uncropped (the verification page); `portrait`
   * crops to the app's 4:5 frame.
   */
  fit?: 'natural' | 'portrait';
  /** The line over the photo at rest, beside the mark. */
  status?: ReactNode;
  /**
   * The proof metadata the frosted state reveals. It is decorative here —
   * repeat anything that matters in `info` (or elsewhere on the page), since
   * this layer is hidden from screen readers.
   */
  reveal?: ReactNode;
  /**
   * Shows the reveal without a hover or tap — for a page that demonstrates
   * it on its own (the homepage hero). Hover and tap still work as usual.
   */
  revealed?: boolean;
  /** Info card below the photo: label/value metadata. */
  info?: ReactNode;
  /** Card beside `info`: share / copy link (see ShareActions). */
  actions?: ReactNode;
  className?: string;
}

/**
 * A verified photo with the signature frosted reveal: hover (pointer) or tap
 * (touch, toggles) crossfades to a blurred, white-washed copy with the proof
 * on top. Opacity only, `duration-base` both ways — the blur itself never
 * animates, a pre-blurred layer fades in over the sharp one. The white wash
 * is a radial fade: the blurred photo stays strong in the middle and goes
 * to white at the edges, where the proof text sits.
 */
export function ProofCard({
  src,
  alt,
  width,
  height,
  sizes = '(max-width: 440px) 100vw, 440px',
  unoptimized,
  priority,
  fit = 'natural',
  status,
  reveal,
  revealed = false,
  info,
  actions,
  className,
}: ProofCardProps) {
  const [on, setOn] = useState(false);
  const shown = 'group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[on=true]:opacity-100';
  const hiddenWhenShown = 'group-hover:opacity-0 group-focus-visible:opacity-0 group-data-[on=true]:opacity-0';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <button
        type="button"
        data-on={on || revealed}
        aria-pressed={on}
        aria-label={`${alt}. Show proof details.`}
        onClick={() => setOn((value) => !value)}
        className={cn(
          'group relative block w-full overflow-hidden rounded-lg bg-surface text-left',
          fit === 'portrait' && 'aspect-4/5',
        )}
      >
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          sizes={sizes}
          unoptimized={unoptimized}
          priority={priority}
          className={cn('block w-full', fit === 'portrait' ? 'h-full object-cover' : 'h-auto')}
        />
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          sizes={sizes}
          unoptimized={unoptimized}
          className={cn(
            'absolute inset-0 size-full scale-110 object-cover blur-md opacity-0 transition-opacity duration-base ease-out',
            shown,
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 flex flex-col gap-1 bg-radial from-transparent from-30% via-background/40 via-60% to-background/90 to-85% p-5 text-title text-foreground opacity-0 transition-opacity duration-base ease-out',
            shown,
          )}
        >
          {reveal}
        </div>
        {status ? (
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-x-4 bottom-4 flex items-center gap-3 text-body text-background text-shadow-photo transition-opacity duration-base ease-out',
              hiddenWhenShown,
            )}
          >
            <VerifiedMark className="h-7" />
            <span>{status}</span>
          </div>
        ) : null}
      </button>

      {info || actions ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          {info ? <div className="rounded-md bg-surface px-5 py-4">{info}</div> : null}
          {actions}
        </div>
      ) : null}
    </div>
  );
}
