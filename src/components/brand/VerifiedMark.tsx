import { cn } from '@/lib/utils';

export interface VerifiedMarkProps {
  /**
   * `mark` is the bare spiral in the current text colour. `badge` sets it in
   * a small white circle, for a corner of a card or an avatar.
   */
  variant?: 'mark' | 'badge';
  /**
   * Spoken name. Omit when adjacent copy already says "verified" — the
   * mark is then decorative and hidden from screen readers.
   */
  label?: string;
  className?: string;
}

/**
 * "Verified" is always this spiral (public/brand/mark.svg), never a check,
 * shield or lock. Drawn as a CSS mask so it takes the surrounding colour:
 * black on the page, `text-background` over a photo.
 */
export function VerifiedMark({ variant = 'mark', label, className }: VerifiedMarkProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };

  if (variant === 'badge') {
    return (
      <span
        className={cn(
          'inline-grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-foreground',
          className,
        )}
        {...a11y}
      >
        <span className="h-4 bg-current mask-mark" />
      </span>
    );
  }

  return (
    <span
      className={cn('inline-block h-icon shrink-0 bg-current mask-mark', className)}
      {...a11y}
    />
  );
}
