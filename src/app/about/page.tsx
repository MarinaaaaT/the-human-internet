import type { Metadata } from 'next';
import Link from 'next/link';

import { ContentPage } from '@/components/content/ContentPage';
import { MaybeLink } from '@/components/content/MaybeLink';
import { Prose } from '@/components/content/Prose';
import { EXTERNAL_LINKS, ROUTES } from '@/content/site';

export const metadata: Metadata = {
  title: 'about',
  description:
    'The human network is a dedicated space for humans on the internet — tools to connect real people making real things.',
};

export default function AboutPage() {
  return (
    <ContentPage
      title="about"
      lede="A dedicated space for humans on the internet."
      breadcrumbs={[{ label: 'home', href: ROUTES.home }]}
    >
      <Prose>
        <h2>what is the human network?</h2>
        <p>
          The human network is a dedicated space for humans on the internet.
          I&rsquo;m building tools to connect real people making real things,
          because creating and sharing with one another is the heart of the
          human experience and I think it&rsquo;s worth protecting. The goal is
          to flip the AI-first business model on its head, so people keep the
          ability to find and filter for genuinely human content online.
        </p>
        <p>
          The first product does one thing: it gives you a link to share
          alongside your photos on your favorite social platforms,{' '}
          <Link href={ROUTES.verification}>proving a real human took them</Link>
          .
        </p>
        <p>
          I&rsquo;ve tried to build the structure to match the promise. I will
          never sell the content you create here — everything you make is 100%
          yours. This is a community project right now, not a for-profit
          company, and as it gains traction I plan to register it as a public
          benefit corporation, like Kickstarter.
        </p>

        <h2>pro-human, not anti-AI</h2>
        <p>I&rsquo;m not against AI. I&rsquo;m against AI slop.</p>
        <p>
          AI should be a tool that helps you express yourself better.
          There&rsquo;s a real gray area here, and I accept that — people use AI
          to sharpen their writing, edit their photos, explore ideas, and make
          better work. That&rsquo;s fine.
        </p>
        <p>
          What I believe is simpler: a human-centered creation process produces
          better output. That&rsquo;s what I&rsquo;m building for.
        </p>

        <h2>who am I and why did I make the app?</h2>
        {/* The intro video from the Notion source hasn't been recorded yet;
            set EXTERNAL_LINKS.introVideo to surface it here. */}
        <p>
          I&rsquo;m a product manager. My whole job is finding real problems
          that real people are having, and then building something to fix them.
          Which means I spend most of my time reading what people actually say —
          forums, comments, reviews, weird niche communities at 1am.
        </p>
        <p>
          That&rsquo;s getting harder. Between AI, bot farms, and paid content,
          I increasingly can&rsquo;t tell whose problem is real. So this app is
          me doing my job on the problem that&rsquo;s making my job impossible.
        </p>
        <p>
          Also, I&rsquo;m not even a boomer and I can no longer tell if that
          goat video is real. Help me lol.
        </p>

        <h2>get involved</h2>
        <p>
          This is being built in the open, and there&rsquo;s room for you in it.
        </p>
        <ul>
          <li>
            <strong>
              <MaybeLink href={EXTERNAL_LINKS.donate}>
                Support the work
              </MaybeLink>
            </strong>{' '}
            — Donations go straight into building this.
          </li>
          <li>
            <strong>
              <MaybeLink href={EXTERNAL_LINKS.roadmap}>
                See what&rsquo;s coming next
              </MaybeLink>
            </strong>{' '}
            — I try to keep the roadmap and feature list up to date and public.
          </li>
          <li>
            <strong>
              <MaybeLink href={EXTERNAL_LINKS.discord}>
                Talk to real humans
              </MaybeLink>
            </strong>{' '}
            — Questions, comments, feedback? Want to build with me?
          </li>
        </ul>
      </Prose>
    </ContentPage>
  );
}
