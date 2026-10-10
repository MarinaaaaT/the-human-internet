import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

/**
 * Three CTA roles (DESIGN.md → Components → Button), all pills:
 * - primary: black. At most one per screen.
 * - secondary: light grey.
 * - tertiary: text only, for low-emphasis actions ("Not now").
 * Plus `destructive` for confirmations, and `size="icon"` for the 48px grey
 * circle that holds a single lucide icon (needs an aria-label).
 *
 * Motion is colour/opacity only — no press-down translate.
 */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium text-label whitespace-nowrap select-none transition-[background-color,color,opacity] duration-fast ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-icon',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:opacity-85',
        secondary: 'bg-surface text-foreground hover:bg-surface-hover',
        tertiary: 'text-foreground hover:text-muted-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-85',
      },
      size: {
        default: 'h-control px-5',
        icon: 'size-icon-button',
      },
    },
    compoundVariants: [
      // An icon button is always a grey circle, even if a caller forgets
      // the variant; tertiary keeps its bare look for a close "x".
      { size: 'icon', variant: 'primary', className: 'bg-surface text-foreground hover:bg-surface-hover hover:opacity-100' },
      { size: 'default', variant: 'tertiary', className: 'px-2' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'primary',
  size = 'default',
  asChild = false,
  type,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render the single child (e.g. a next/link) with button styling. */
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      // A bare <button> defaults to "submit"; ours never mean that unless asked.
      type={asChild ? type : (type ?? 'button')}
      {...props}
    />
  );
}

export { Button, buttonVariants };
