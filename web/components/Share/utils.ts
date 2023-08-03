import siteConfig from '@/site.config';
import { headers } from 'next/headers';

export function getOrigin () {
  if (typeof location !== 'undefined') {
    return location.origin;
  }

  const referer = headers().get('referer');
  if (!referer) {
    return siteConfig.host;
  }

  return (new URL(referer)).origin;
}