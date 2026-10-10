'use client';

import Link from 'next/link';

import { Wordmark } from '@/components/brand/Wordmark';
import { NAV_LINKS, ROUTES } from '@/content/site';
import { useScrolledPast } from '@/hooks/useScrolledPast';
import { cn } from '@/lib/utils';

/** Scroll distance past which the sticky bar fades in. */
const REVEAL_AFTER_PX = 160;

export interface SiteHeaderProps {
  /**
   * The homepage hides the bar until the hero is scrolled past. Content pages
   * have no hero to reveal it, so they pin it from the top instead.
   */
  alwaysVisible?: boolean;
}

export function SiteHeader({ alwaysVisible = false }: SiteHeaderProps) {
  const scrolled = useScrolledPast(REVEAL_AFTER_PX);
  const visible = alwaysVisible || scrolled;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-20 border-b border-border bg-background/70 backdrop-blur-md transition-opacity duration-base ease-out',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      // Kept out of the tab order and the a11y tree while it's invisible,
      // so keyboard focus can't land on an off-screen link.
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="mx-auto flex max-w-marketing items-center justify-between px-6 py-4 md:px-10">
        <Link href={ROUTES.home} className="flex min-h-touch items-center text-foreground">
          <Wordmark />
        </Link>
        <nav className="flex gap-6 text-label">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-touch items-center text-muted-foreground transition-colors duration-fast ease-out hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
