import Image from 'next/image';

import type { ReactNode } from 'react';

import { LabelValue } from '@/components/brand/LabelValue';
import { cn } from '@/lib/utils';

export interface NotificationCardProps {
  /** A photo or a doodle, shown in a white square. */
  thumbnail: string;
  thumbnailAlt?: string;
  label: ReactNode;
  value: ReactNode;
  /** Optional corner badge: a `VerifiedMark variant="badge"` or a `HighlightBadge`. */
  corner?: ReactNode;
  className?: string;
}

export function NotificationCard({
  thumbnail,
  thumbnailAlt = '',
  label,
  value,
  corner,
  className,
}: NotificationCardProps) {
  return (
    <div className={cn('relative flex items-center gap-4 rounded-lg bg-surface p-3', className)}>
      <Image
        src={thumbnail}
        alt={thumbnailAlt}
        width={128}
        height={128}
        className="size-thumbnail shrink-0 rounded-sm bg-background object-cover"
      />
      <LabelValue label={label}>{value}</LabelValue>
      {corner ? <div className="absolute -top-2 -right-2">{corner}</div> : null}
    </div>
  );
}
