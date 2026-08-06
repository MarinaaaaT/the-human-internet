import { AlertTriangle } from '@/components/icons/AlertTriangle';
import { SiteHeader } from '@/components/marketing/SiteHeader';

import styles from './page.module.css';

/**
 * Matches the iOS app's PhotoVerificationView not-found copy, so the two
 * surfaces agree when the same id is broken or mistyped on either.
 */
export default function PhotoNotFound() {
  return (
    <>
      <SiteHeader alwaysVisible />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <AlertTriangle className={styles.notFoundIcon} />
            <p>This photo couldn&rsquo;t be found.</p>
          </div>
        </div>
      </main>
    </>
  );
}
