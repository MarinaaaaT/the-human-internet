'use client';

import { Copy, Forward } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

/**
 * The share / copy-link card that sits beside a ProofCard's info. Shares
 * `url`, or the current page when omitted. "Share" only appears where the
 * browser has a native share sheet.
 */
export function ShareActions({
  url,
  title,
  className,
}: {
  url?: string;
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  // Server render has no navigator; reading it this way avoids a hydration
  // mismatch when the client does.
  const canShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.share === 'function',
    () => false,
  );

  const target = () => url ?? window.location.href;

  const share = async () => {
    try {
      await navigator.share({ url: target(), title });
    } catch {
      // Dismissing the share sheet rejects; nothing to do.
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(target());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const row =
    'flex min-h-touch items-center gap-2 px-1 text-label text-foreground transition-colors duration-fast ease-out hover:text-muted-foreground';

  return (
    <div className={cn('flex flex-col justify-center divide-y divide-border rounded-md bg-surface px-3 py-1', className)}>
      {canShare ? (
        <button type="button" className={row} onClick={share}>
          <Forward className="size-4" strokeWidth={1.5} aria-hidden="true" />
          Share
        </button>
      ) : null}
      <button type="button" className={row} onClick={copy}>
        <Copy className="size-4" strokeWidth={1.5} aria-hidden="true" />
        <span aria-live="polite">{copied ? 'Link copied.' : 'Copy link'}</span>
      </button>
    </div>
  );
}

const noopSubscribe = () => () => {};
