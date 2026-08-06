import Link from 'next/link';

import type { ReactNode } from 'react';

import styles from './ContentPage.module.css';

export interface Crumb {
  label: string;
  href: string;
}

export interface ContentPageProps {
  title: string;
  /** Optional standfirst shown under the title. */
  lede?: ReactNode;
  /** Ancestors only — the current page is appended automatically. */
  breadcrumbs?: Crumb[];
  children: ReactNode;
}

/** Shared shell for long-form pages: breadcrumbs, title, lede, body. */
export function ContentPage({
  title,
  lede,
  breadcrumbs = [],
  children,
}: ContentPageProps) {
  return (
    <article className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          {breadcrumbs.length > 0 && (
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              {breadcrumbs.map((crumb) => (
                <span key={crumb.href}>
                  <Link href={crumb.href}>{crumb.label}</Link>
                  <span className={styles.separator} aria-hidden="true">
                    {' / '}
                  </span>
                </span>
              ))}
              <span className={styles.current} aria-current="page">
                {title}
              </span>
            </nav>
          )}
          <h1 className={styles.title}>{title}</h1>
          {lede && <p className={styles.lede}>{lede}</p>}
        </header>
        {children}
      </div>
    </article>
  );
}
