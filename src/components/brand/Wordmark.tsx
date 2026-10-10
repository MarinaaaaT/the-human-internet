import { cn } from '@/lib/utils';

import { SITE_NAME } from '@/content/site';

/**
 * "the human ~ internet", from public/brand/wordmark.svg. Always lowercase,
 * never re-set in type. Height drives size; width follows the artwork.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label={SITE_NAME}
      className={cn('inline-block h-4 bg-current mask-wordmark', className)}
    />
  );
}
