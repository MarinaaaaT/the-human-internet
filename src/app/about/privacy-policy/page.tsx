import type { Metadata } from 'next';

import { ContentPage } from '@/components/content/ContentPage';
import { MaybeLink } from '@/components/content/MaybeLink';
import { Callout, Prose } from '@/components/content/Prose';
import {
  EXTERNAL_LINKS,
  ROUTES,
  STRIPE_PRIVACY_EMAIL,
  STRIPE_PRIVACY_URL,
} from '@/content/site';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'What the human internet collects, how it is used, and how to delete it. Your identity and your creations belong to you.',
};

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      title="Privacy policy"
      lede="Effective date: October 27, 2026."
      breadcrumbs={[
        { label: 'Home', href: ROUTES.home },
        { label: 'About', href: ROUTES.about },
      ]}
    >
      <Prose>
        <Callout>
          <p>
            <strong>
              Your identity belongs to you. Your creations belong to you.
            </strong>
          </p>
          <p>
            We collect only what we need to help you create and share authentic
            human-made content. You choose what personal information accompanies
            your work, and you can delete your account and the information we
            store at any time.
          </p>
          <p>
            What you share beyond our platform is yours to control — but once
            others have copied it, we cannot erase those copies.
          </p>
        </Callout>

        <h2>1. Our commitment to privacy</h2>
        <p>
          The human internet exists to help people create, share, and discover
          authentic human-made content. We believe people should control their
          personal information, creative work, and how they represent themselves
          online. We aim to collect only the information needed to provide our
          services, be transparent about its use, and give users control over
          their data.
        </p>

        <h2>2. Information we collect</h2>
        <p>
          <strong>Account information</strong>
        </p>
        <ul>
          <li>First name</li>
          <li>Last name</li>
          <li>Social media handles you choose to provide</li>
        </ul>
        <p>
          <strong>Creative content</strong>
        </p>
        <ul>
          <li>
            Original photographs you upload or create using the human internet
          </li>
          <li>
            Edited versions of those photographs, including version history
          </li>
          <li>
            Information you choose to associate with or embed in photographs
          </li>
        </ul>
        <p>
          We store this information to provide our core services, including
          content management, editing history, and sharing and verification
          tools.
        </p>

        <h3>Identity verification information</h3>
        <p>
          We use Stripe Identity, a third-party identity verification service,
          to verify users&rsquo; identities. Stripe may collect government-issued
          identification documents, photographs, and biometric information
          during verification.
        </p>
        <p>
          <strong>
            This information is collected and stored by Stripe. The human
            internet does not independently store copies of identity documents,
            selfies, or biometric information submitted through Stripe Identity.
          </strong>{' '}
          We may access or receive verification results to determine whether
          identity verification was successful.
        </p>
        <p>
          Verification information is processed according to{' '}
          <a href={STRIPE_PRIVACY_URL} target="_blank" rel="noreferrer noopener">
            Stripe&rsquo;s Privacy Policy
          </a>
          , which describes Stripe&rsquo;s collection, use, sharing, and
          retention practices.
        </p>

        <h2>3. How we use your information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Create and maintain your account.</li>
          <li>
            Provide tools for creating, editing, storing, and managing
            photographs.
          </li>
          <li>Maintain the version history of your creative work.</li>
          <li>Verify content authenticity and provenance.</li>
          <li>
            Associate content with identifying information when you choose to do
            so.
          </li>
          <li>Enable sharing to other platforms.</li>
          <li>Maintain the security and functionality of our services.</li>
        </ul>
        <p>
          We do not independently use Stripe-collected identity documents or
          biometric information outside the identity verification process.
        </p>

        <h2>4. Your control over information embedded in photographs</h2>
        <p>
          <strong>
            You decide what personal information, if any, is embedded in
            photographs you create or share through the human internet.
          </strong>
        </p>
        <p>
          This may include your name, social media handles, or other
          identifying details. You are responsible for reviewing and selecting
          the personal information you wish to embed before sharing. Some
          technical provenance information may be needed to support
          authenticity verification; this is separate from the personal
          identification details you choose to provide.
        </p>

        <h3>Embedded information can persist</h3>
        <p>
          When you share or distribute a photograph, other people may download,
          copy, or redistribute it. If it contains embedded personal
          information, that information may remain accessible to people holding
          a copy.
        </p>
        <p>
          <strong>
            Deleting your account or removing a photograph from the human
            internet does not delete copies held by other people or platforms.
          </strong>{' '}
          We cannot control, modify, or remove information embedded in copies
          no longer stored within our systems.
        </p>

        <h2>5. Sharing your information</h2>
        <p>
          We share information only as necessary to operate our services,
          comply with law, or when you choose to share content.
        </p>
        <ul>
          <li>
            <strong>Stripe Identity:</strong> Stripe handles verification
            information under its own privacy practices.
          </li>
          <li>
            <strong>Content you share:</strong> Photographs and any information
            you elect to embed may be accessible to recipients or the public,
            depending on how you share them.
          </li>
          <li>
            <strong>Service providers:</strong> Infrastructure providers may
            process information on our behalf to host, secure, store, and
            deliver our services.
          </li>
          <li>
            <strong>Legal requirements:</strong> We may disclose information
            where required by applicable law.
          </li>
        </ul>

        <h2>6. Data storage and retention</h2>
        <p>
          We retain account information and creative content for as long as
          your account remains active, unless you delete specific content or
          request account deletion. This includes original photographs and
          saved editing histories.
        </p>
        <p>
          When you delete your account, we delete the personal information and
          creative content associated with your account from our systems.
          Stripe identity verification information is handled separately as
          described below.
        </p>

        <h2>7. Deleting your account and personal information</h2>
        <p>
          You may request account deletion at any time. When your account is
          deleted, the human internet deletes from its systems:
        </p>
        <ul>
          <li>Your first and last name.</li>
          <li>Your saved social media handles.</li>
          <li>Your original photographs.</li>
          <li>All stored edited versions and version histories.</li>
          <li>
            Other personal information or creative content associated with your
            account.
          </li>
        </ul>

        <h3>Deleting Stripe Identity information</h3>
        <p>
          Identity verification information is stored by Stripe, not in our own
          databases. You may ask us to delete verification information held on
          our behalf within our Stripe account. We will submit the appropriate
          deletion request to Stripe. Stripe may retain certain information
          independently where required or permitted by law or for other
          purposes described in its privacy policy.
        </p>
        <p>
          For information Stripe processes independently, you may also contact
          Stripe at{' '}
          <a href={`mailto:${STRIPE_PRIVACY_EMAIL}`}>{STRIPE_PRIVACY_EMAIL}</a>.
        </p>

        <h3>Limits of deletion</h3>
        <p>
          Deleting your account does not reverse prior distribution of your
          photographs. We cannot remotely remove copies others have downloaded,
          saved, or redistributed, including their embedded information.
          Content shared on other platforms is subject to those platforms&rsquo;
          own policies.
        </p>

        <h2>8. Your privacy rights</h2>
        <p>
          You may request to access, correct, or update information we store
          about you; delete photographs and their stored versions; delete your
          account; or request that we delete Stripe verification information
          held on our behalf. Applicable privacy laws may provide additional
          rights. Contact us using the information below to make a request.
        </p>

        <h2>9. Data security</h2>
        <p>
          We use reasonable technical and organizational measures to protect
          information stored in our systems. Sensitive identity verification is
          handled through Stripe Identity, which maintains its own security
          practices. No online service can guarantee absolute security.
        </p>

        <h2>10. Third-party platforms</h2>
        <p>
          You may share content through third-party websites and social media
          services. Their privacy policies and terms apply to content
          distributed on those platforms. We are not responsible for their
          independent collection, storage, sharing, or removal of that content.
        </p>

        <h2>11. Children&rsquo;s privacy</h2>
        <p>
          The human internet is not intended for children under 13. We do not
          knowingly collect personal information from children under 13 and
          will take steps to delete such information if we discover it.
        </p>

        <h2>12. Changes to this policy</h2>
        <p>
          We may update this policy as our services or legal requirements
          change. We will provide notice of material changes through our
          website, app, or other appropriate channels. The effective date above
          indicates the latest revision.
        </p>

        <h2>13. Contact us</h2>
        <ul>
          <li>
            Website: <a href={SITE_URL}>{new URL(SITE_URL).host}</a>
          </li>
          <li>
            Discord:{' '}
            <MaybeLink href={EXTERNAL_LINKS.discord}>
              Join our discord
            </MaybeLink>
          </li>
        </ul>
      </Prose>
    </ContentPage>
  );
}
