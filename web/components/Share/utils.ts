import { toWidgetPathname } from '@/components/Widget/utils';
import siteConfig from '@/site.config';
import { widgetMetadataGenerator, widgetVisualizer } from '@/utils/widgets';
import { ShareOptions } from '@ossinsight/ui/src/components/ShareBlock';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';

export function getOrigin () {
  if (typeof location !== 'undefined') {
    return location.origin;
  }

  const { headers } = require('next/headers');
  const host = headers().get('host');
  if (!host) {
    return siteConfig.host;
  }

  return /^localhost:/.test(host) ? 'http://' + host : 'https://' + host;
}

export async function createShareInfo (fullName: string, linkedData: LinkedData, params: Record<string, string>): Promise<ShareOptions> {
  const generateMetadata = await widgetMetadataGenerator(fullName);

  const { title, keywords } = generateMetadata(
    createWidgetContext('client', params, linkedData),
  );

  const usp = new URLSearchParams(params);
  const imageUsp = new URLSearchParams(usp);
  imageUsp.set('image_size', 'auto');

  const origin = getOrigin();

  const { width } = await widgetVisualizer(fullName);
  const pathname = toWidgetPathname(fullName)
  return {
    title: title || 'Untitled',
    url: `${origin}${pathname}?${usp.toString()}`,
    thumbnailUrl: `${origin}${pathname}/thumbnail.png?${imageUsp.toString()}`,
    keywords,
    imageWidth: width ?? 720,
  };
}