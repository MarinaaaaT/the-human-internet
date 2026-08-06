import type { Metadata } from 'next';

import { ContentPage } from '@/components/content/ContentPage';
import { Acronym, Prose } from '@/components/content/Prose';
import { ROUTES } from '@/content/site';

export const metadata: Metadata = {
  title: 'proving you’re a real person',
  description:
    'A one-time identity check confirms there is one real person behind each account. Two ways through it.',
};

export default function IdentityPage() {
  return (
    <ContentPage
      title="proving you’re a real person"
      lede="A one-time check when you register. After that, you never think about it again."
      breadcrumbs={[
        { label: 'home', href: ROUTES.home },
        { label: 'about', href: ROUTES.about },
        { label: 'verification', href: ROUTES.verification },
      ]}
    >
      <Prose>
        <p>
          This is a one-time thing. You do it when you register, and then you
          never think about it again.
        </p>
        <p>
          There are two ways through it. Which one you get depends on what our
          identity provider can confirm about you.
        </p>

        <h2>
          option 1: your <Acronym>ID</Acronym> and a quick video
        </h2>
        <ol>
          <li>You enter some basic personal info.</li>
          <li>You photograph your government-issued ID.</li>
          <li>
            You do a liveness check — a short video where you follow a few
            on-screen prompts, like turning your head or blinking.
          </li>
        </ol>
        <p>
          The video step is what makes the ID meaningful. It confirms a live
          person is actually holding that ID, rather than someone holding up a
          photo of somebody else&rsquo;s license.
        </p>

        <h2>option 2: your phone number and Social</h2>
        <ol>
          <li>You enter your phone number and Social Security number.</li>
          <li>
            Our identity provider checks your number against your mobile
            carrier&rsquo;s records — confirming the device is genuinely yours,
            and that the line isn&rsquo;t brand new or recently ported.
          </li>
          <li>
            It cross-checks that against the identity information you submitted.
          </li>
        </ol>
        <p>No ID photo, no video. This one takes seconds.</p>

        <p>
          Either path is answering the same question: is there one real person
          behind this account?
        </p>
      </Prose>
    </ContentPage>
  );
}
