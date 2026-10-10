import Link from 'next/link';

import type { ReactNode } from 'react';

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
    // The top padding clears the fixed site header, pinned on content pages.
    <article className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <header className="mb-12">
          {breadcrumbs.length > 0 && (
            <nav
              className="mb-6 flex flex-wrap items-center gap-2 text-caption text-muted-foreground"
              aria-label="Breadcrumb"
            >
              {breadcrumbs.map((crumb) => (
                <span key={crumb.href}>
                  <Link
                    href={crumb.href}
                    className="transition-colors duration-fast ease-out hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                  <span aria-hidden="true">{' / '}</span>
                </span>
              ))}
              <span className="text-foreground" aria-current="page">
                {title}
              </span>
            </nav>
          )}
          <h1 className="text-h2 text-foreground md:text-h1">{title}</h1>
          {lede && (
            <p className="mt-5 text-title text-muted-foreground text-pretty">{lede}</p>
          )}
        </header>
        {children}
      </div>
    </article>
  );
}
