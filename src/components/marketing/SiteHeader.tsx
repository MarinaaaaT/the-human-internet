'use client';

import { NAV_LINKS, SITE_NAME } from '@/content/site';
import { useScrolledPast } from '@/hooks/useScrolledPast';

import styles from './SiteHeader.module.css';

/** Scroll distance past which the sticky bar fades in. */
const REVEAL_AFTER_PX = 160;

export function SiteHeader() {
  const visible = useScrolledPast(REVEAL_AFTER_PX);

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
        <span className={styles.wordmark}>{SITE_NAME}</span>
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
