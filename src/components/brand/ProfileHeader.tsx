import Image from 'next/image';

import type { ReactNode } from 'react';

import { VerifiedMark } from '@/components/brand/VerifiedMark';
import { cn } from '@/lib/utils';

export interface ProfileHeaderProps {
  avatar: string;
  name: ReactNode;
  /** Muted line: "Influencer · Joined 2026 · 84 verified photos". */
  meta?: ReactNode;
  /** Overlap the spiral on the avatar. Only for a verified human. */
  verified?: boolean;
  className?: string;
}

export function ProfileHeader({ avatar, name, meta, verified = false, className }: ProfileHeaderProps) {
  return (
    <div className={cn('flex items-center gap-3 rounded-md bg-surface px-4 py-3', className)}>
      <div className="flex shrink-0">
        <Image
          src={avatar}
          alt=""
          width={80}
          height={80}
          className="size-10 rounded-full border-2 border-surface object-cover"
        />
        {verified ? (
          <VerifiedMark
            variant="badge"
            label="Verified human"
            className="-ml-3 size-10 border-2 border-surface"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-title text-foreground">{name}</span>
        {meta ? <span className="text-caption text-muted-foreground">{meta}</span> : null}
      </div>
    </div>
  );
}
