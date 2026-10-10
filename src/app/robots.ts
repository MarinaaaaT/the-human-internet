import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/**
 * Verification pages (`/[photoId]`) are deliberately *not* disallowed here:
 * link-preview bots (facebookexternalhit, Twitterbot, Slackbot…) honour
 * robots.txt, so blocking them would break the card every shared link
 * unfurls into — and a crawler that can't fetch a page can't see its
 * `noindex` either. They're kept out of search by that page's own metadata.
 *
 * AI search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) fall
 * under `*`, so the site can be cited in AI answers. Training crawlers are
 * opted out; that group doesn't affect search visibility.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/styleguide' },
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
          'CCBot',
          'Meta-ExternalAgent',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
