import { SiteHeader } from '@/components/marketing/SiteHeader';

/**
 * Content pages share the homepage's header, but pinned rather than
 * revealed on scroll — there's no hero here to scroll past.
 */
export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader alwaysVisible />
      <main>{children}</main>
    </>
  );
}
