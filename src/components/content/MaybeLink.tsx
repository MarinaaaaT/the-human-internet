import type { ReactNode } from 'react';

/**
 * Renders a link when a destination exists, and plain text when it doesn't.
 *
 * Several destinations referenced by the About copy (Discord, the roadmap)
 * haven't been set up yet. Rendering them as text keeps the sentence intact
 * without shipping a link that goes nowhere; filling in the URL in
 * `src/content/site.ts` promotes it to a real link with no other change.
 */
export function MaybeLink({
  href,
  children,
}: {
  href: string | null | undefined;
  children: ReactNode;
}) {
  if (!href) return <>{children}</>;
  return <a href={href}>{children}</a>;
}
