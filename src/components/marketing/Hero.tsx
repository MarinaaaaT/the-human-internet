import { VerifiedMark } from '@/components/brand/VerifiedMark';
import { Wordmark } from '@/components/brand/Wordmark';
import { HeroCards } from '@/components/marketing/HeroCards';

export function Hero() {
  return (
    // Exactly one screen tall, so the cards can sit on its bottom edge: the
    // fan is pinned to the bottom and pushed down a quarter of its height,
    // and the section clips the rest. The fan runs nearly edge to edge on a
    // laptop; on a wider screen the height left under the headline sizes it,
    // and it centres with white space either side.
    //
    // `id="download"` is where the nav's "Join" and the About page's "Get
    // the app" land until there's an App Store link to send them to.
    <section
      id="download"
      className="relative flex h-svh min-h-160 flex-col items-center overflow-hidden bg-background"
    >
      <div className="flex animate-reveal flex-col items-center gap-6 px-6 pt-12 text-center md:gap-7 md:pt-14">
        <Wordmark className="h-5 md:h-6" />
        <h1 className="mt-4 text-h2 text-foreground text-balance md:text-display">
          {/* The site header fades in once this first line has scrolled out
              of view (SiteHeader measures it). */}
          <span data-header-reveal className="block">
            We made the internet.
          </span>
          We just never signed it.
        </h1>
        <VerifiedMark className="h-8 md:h-10" />
      </div>

      <div className="relative hero-fan-area w-full flex-1 px-2 pt-8 md:pt-10">
        <HeroCards className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4" />
      </div>
    </section>
  );
}
