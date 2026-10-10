import { AppleLogo } from '@/components/icons/AppleLogo';
import { Button } from '@/components/ui/button';
import { APP_STORE_URL } from '@/content/site';

/** The one primary CTA on the homepage: a black pill. */
export function AppStoreBadge() {
  return (
    <Button asChild>
      <a href={APP_STORE_URL}>
        <AppleLogo className="size-5" />
        Download on the App Store
      </a>
    </Button>
  );
}
