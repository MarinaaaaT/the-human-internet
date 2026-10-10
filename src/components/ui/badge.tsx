import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

/**
 * Small round chip. `highlight` (the one blue) is for counts and streaks
 * only — see HighlightBadge, which is the usual way to reach it.
 */
const badgeVariants = cva(
  'inline-flex h-8 min-w-8 w-fit shrink-0 items-center justify-center gap-1 rounded-full px-2 font-medium text-caption whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-4',
  {
    variants: {
      variant: {
        highlight: 'bg-highlight text-highlight-foreground',
        secondary: 'bg-surface text-foreground',
        outline: 'border border-border bg-background text-foreground',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  },
);

function Badge({
  className,
  variant = 'secondary',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
