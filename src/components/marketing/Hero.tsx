import Image from 'next/image';

import { AppStoreBadge } from '@/components/marketing/AppStoreBadge';
import { HOW_IT_WORKS_ANCHOR } from '@/content/site';

import heroImage from '@/../public/images/hero-blurred-woman.png';

export function Hero() {
  return (
    // Painted `surface-hover`, the same grey as the photo's top edge, so on
    // mobile — where the photo only fills the lower part — the two meet
    // without a seam.
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-surface-hover">
      <div className="absolute inset-x-0 top-7/12 bottom-0 md:inset-0">
        <Image
          // Desktop reproduces the original `background-size: 190% auto;
          // background-position: 70% 100%`: a 190%-wide image overflows by
          // 90%, and 70% of that is -63%. `max-w-none` opts out of the
          // preflight `img { max-width: 100% }`.
          className="size-full object-cover object-[52%_22%] md:absolute md:bottom-0 md:-left-[63%] md:h-auto md:w-[190%] md:max-w-none"
          src={heroImage}
          alt=""
          // Above the fold: skip lazy-loading so it isn't the LCP bottleneck.
          priority
          sizes="190vw"
          placeholder="blur"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-marketing flex-1 content-start px-6 pt-24 pb-16 md:grid-cols-5 md:px-10 md:pt-32 md:pb-24">
        <div className="flex animate-reveal flex-col gap-6 md:col-span-2 md:col-start-4">
          <h1 className="text-h2 text-foreground md:text-h1">Join the human internet.</h1>
          <p className="max-w-prose text-body text-foreground text-pretty">
            Keep the internet alive with proof that real people are behind the
            content they create. No bots. No AI. Just humans around the world
            making and sharing things they care about.{' '}
            <a
              className="underline underline-offset-4 transition-colors duration-fast ease-out hover:text-muted-foreground"
              href={HOW_IT_WORKS_ANCHOR}
            >
              Learn more
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-6" id="download">
            <AppStoreBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
