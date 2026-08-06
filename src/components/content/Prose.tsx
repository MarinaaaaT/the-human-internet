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
