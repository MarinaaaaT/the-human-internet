'use client';

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';

import { isPhotoIdShape } from '@/lib/photos/photoIdShape';

/**
 * Vercel Web Analytics (cookieless). Every verification link is its own
 * `/{shortCode}` URL, so they're folded into one `/[photoId]` entry before
 * sending: the dashboard gets total verification-page traffic, and the codes
 * people shared never leave the browser. Query strings are dropped for the
 * same reason.
 */
function collapsePhotoIds(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url);
  const segment = url.pathname.split('/')[1] ?? '';
  if (isPhotoIdShape(segment)) {
    url.pathname = '/[photoId]';
  }
  url.search = '';
  return { ...event, url: url.toString() };
}

export function SiteAnalytics() {
  return <Analytics beforeSend={collapsePhotoIds} />;
}
