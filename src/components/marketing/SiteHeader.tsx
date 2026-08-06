'use client';

import Link from 'next/link';

import { NAV_LINKS, ROUTES, SITE_NAME } from '@/content/site';
import { useScrolledPast } from '@/hooks/useScrolledPast';

import styles from './SiteHeader.module.css';

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
      className={styles.header}
      data-visible={visible}
      // Kept out of the tab order and the a11y tree while it's invisible,
      // so keyboard focus can't land on an off-screen link.
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className={styles.inner}>
        <Link className={styles.wordmark} href={ROUTES.home}>
          {SITE_NAME}
        </Link>
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
