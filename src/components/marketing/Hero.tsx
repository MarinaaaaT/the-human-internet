import Image from 'next/image';

import { AppStoreBadge } from '@/components/marketing/AppStoreBadge';
import { HOW_IT_WORKS_ANCHOR } from '@/content/site';

import heroImage from '@/../public/images/hero-blurred-woman.png';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backdrop}>
        <Image
          className={styles.image}
          src={heroImage}
          alt=""
          // Above the fold: skip lazy-loading so it isn't the LCP bottleneck.
          priority
          sizes="190vw"
          placeholder="blur"
        />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <h1 className={styles.title}>join the human network</h1>
          <p className={styles.lede}>
            Keep the internet alive with proof that real people are behind the
            content they create. No bots. No AI. Just humans around the world
            making and sharing things they care about.{' '}
            <a className={styles.ledeLink} href={HOW_IT_WORKS_ANCHOR}>
              Learn more
            </a>
          </p>
          <div className={styles.actions} id="download">
            <AppStoreBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
