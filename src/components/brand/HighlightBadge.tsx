import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';

/**
 * The one blue in the system, for counts and streaks ("3x") only — never a
 * button, link or large area. Give it a `label` when the count alone
 * wouldn't make sense read aloud.
 */
export function HighlightBadge({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <Badge variant="highlight" className={className} aria-label={label}>
      {children}
    </Badge>
  );
}
