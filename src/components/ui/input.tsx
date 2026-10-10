import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Grey field, white on focus. Pair with a <label> (text-label,
 * muted) and, on error, `aria-invalid` plus a text-label destructive message.
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-control w-full min-w-0 rounded-md border border-transparent bg-surface px-4 text-body text-foreground transition-colors duration-fast ease-out outline-none placeholder:text-muted-foreground focus-visible:bg-background focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
