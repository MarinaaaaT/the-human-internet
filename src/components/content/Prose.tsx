import { Minus, Plus } from 'lucide-react';

import type { ReactNode } from 'react';

/**
 * Long-form typography, applied once on a wrapper so page bodies can be
 * written as plain semantic HTML. One weight: emphasis (`strong`, links,
 * headings) is black against muted body text, never bold.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        'text-body text-muted-foreground text-pretty',
        '[&>:first-child]:mt-0',
        '[&_h2]:mt-16 [&_h2]:mb-4 [&_h2]:text-h3 [&_h2]:text-foreground',
        '[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-title [&_h3]:text-foreground',
        // Linkable headings are jumped to from elsewhere on the site; without
        // this they land underneath the fixed site header.
        '[&_h2[id]]:scroll-mt-24 [&_h3[id]]:scroll-mt-24',
        '[&_p]:mb-5 [&_p]:max-w-prose',
        '[&_ul]:mb-5 [&_ul]:max-w-prose [&_ul]:list-disc [&_ul]:pl-6',
        '[&_ol]:mb-5 [&_ol]:max-w-prose [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_li]:mb-3 [&_li]:pl-1 [&_li]:marker:text-subtle-foreground',
        '[&_strong]:text-foreground [&_em]:text-foreground',
        '[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:duration-fast [&_a]:ease-out [&_a:hover]:text-muted-foreground',
      ].join(' ')}
    >
      {children}
    </div>
  );
}

/** A boxed aside for a caveat or summary within prose. Flat, like every card. */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 max-w-prose rounded-md bg-surface px-6 py-5 [&>:last-child]:mb-0">
      {children}
    </div>
  );
}

/**
 * One FAQ entry: a native disclosure, so it works without JavaScript. The
 * icon swaps rather than rotates — motion is opacity only.
 */
export function Faq({ question, children }: { question: ReactNode; children: ReactNode }) {
  return (
    <details className="group max-w-prose border-b border-border [&>:not(summary)]:mb-4">
      <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-4 text-body text-foreground [&::-webkit-details-marker]:hidden">
        {question}
        <Plus className="size-4 shrink-0 group-open:hidden" strokeWidth={1.5} aria-hidden="true" />
        <Minus className="hidden size-4 shrink-0 group-open:block" strokeWidth={1.5} aria-hidden="true" />
      </summary>
      {children}
    </details>
  );
}
