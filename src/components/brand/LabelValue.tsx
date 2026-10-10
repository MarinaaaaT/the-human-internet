import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface LabelValueProps {
  /** Muted line above: "Photo verified", "Weekly Streak". */
  label: ReactNode;
  /** Black line below: "Go show them.", "Hard to miss you now." */
  children: ReactNode;
  /** Size of the value. Proof metadata uses `title`. */
  size?: 'body' | 'title';
  className?: string;
}

/** The core text pattern: a muted label above a black value. */
export function LabelValue({ label, children, size = 'body', className }: LabelValueProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="text-label text-muted-foreground">{label}</span>
      <span className={cn('text-foreground', size === 'title' ? 'text-title' : 'text-body')}>
        {children}
      </span>
    </div>
  );
}
