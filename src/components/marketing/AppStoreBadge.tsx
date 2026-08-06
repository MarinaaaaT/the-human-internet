import { AppleLogo } from '@/components/icons/AppleLogo';
import { APP_STORE_URL } from '@/content/site';

import styles from './AppStoreBadge.module.css';

export function AppStoreBadge() {
  return (
    <a className={styles.badge} href={APP_STORE_URL}>
      <AppleLogo />
      <span className={styles.label}>
        <span className={styles.kicker}>download on the</span>
        <span className={styles.store}>app store</span>
      </span>
    </a>
  );
}
