import siteConfig from '@/site.config';
import { headers } from 'next/headers';

export function getOrigin () {
  if (typeof location !== 'undefined') {
    return location.origin;
  }

  const host = headers().get('host');
  if (!host) {
    return siteConfig.host;
  }

  return + /^localhost:/.test(host) ? 'http://' + host : 'https://' + host;
}