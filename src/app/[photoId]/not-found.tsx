import { TriangleAlert } from 'lucide-react';

import { SiteHeader } from '@/components/marketing/SiteHeader';

/**
 * Matches the iOS app's PhotoVerificationView not-found copy, so the two
 * surfaces agree when the same id is broken or mistyped on either.
 */
export default function PhotoNotFound() {
  return (
    <>
      <SiteHeader alwaysVisible />
      <main className="min-h-svh pt-24 pb-24">
        <div className="mx-auto flex max-w-app flex-col items-center gap-3 px-6 py-16 text-center text-body text-muted-foreground">
          <TriangleAlert className="size-8" strokeWidth={1.5} aria-hidden="true" />
          <p>This photo couldn&rsquo;t be found.</p>
        </div>
      </main>
    </>
  );
}
