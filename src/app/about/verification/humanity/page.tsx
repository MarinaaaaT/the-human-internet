import type { Metadata } from 'next';

import { ContentPage } from '@/components/content/ContentPage';
import { Prose } from '@/components/content/Prose';
import { CONTENT_AUTHENTICITY_URL, ROUTES } from '@/content/site';

export const metadata: Metadata = {
  title: 'proving a human took the photo',
  description:
    'Your phone’s camera signs each photo at the moment of capture, using the open C2PA content credentials standard.',
};

export default function HumanityPage() {
  return (
    <ContentPage
      title="proving a human took the photo"
      lede="Your camera signs the photo at the moment of capture, and that signature travels with it."
      breadcrumbs={[
        { label: 'home', href: ROUTES.home },
        { label: 'about', href: ROUTES.about },
        { label: 'verification', href: ROUTES.verification },
      ]}
    >
      <Prose>
        <ol>
          <li>You snap a photo in our app.</li>
          <li>
            Your phone&rsquo;s camera quietly signs the photo as it&rsquo;s
            taken — think of it as an invisible watermark baked in at the moment
            of capture.
          </li>
          <li>That signature travels with the photo.</li>
          <li>
            We check the signature, and generate your shareable proof link.
          </li>
        </ol>
        <p>
          This is possible because the camera and the photo get
          cryptographically bound together using content credentials, an open
          standard called C2PA. If you want to go down the rabbit hole:{' '}
          <a
            href={CONTENT_AUTHENTICITY_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            Content Authenticity Initiative
          </a>
          .
        </p>
      </Prose>
    </ContentPage>
  );
}
