import type { ReactNode } from 'react';

import styles from './Prose.module.css';

/** Applies long-form typography to plain semantic HTML children. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}

/** A boxed aside for a caveat or summary within prose. */
export function Callout({ children }: { children: ReactNode }) {
  return <div className={styles.callout}>{children}</div>;
}

/**
 * Preserves capitalisation inside headings, which are lowercased site-wide.
 * Use for anything whose capitals carry meaning — acronyms ("ID", "AI"), the
 * pronoun "I", proper nouns. Without it, "your ID" renders as "your id".
 *
 * Wrap the smallest span that needs it rather than a whole heading, so the
 * lowercase house style still applies to the surrounding words.
 */
export function PreserveCase({ children }: { children: ReactNode }) {
  return <span className={styles.preserveCase}>{children}</span>;
}
