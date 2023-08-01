import siteConfig from '@/site.config';
import { widgetMetadataGenerator } from '@/utils/widgets';
import { ShareBlock } from '@ossinsight/ui/src/components/ShareBlock';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createWidgetContext } from '../../../packages/widgets-core/src/utils/context';

export async function Share ({ name, params, searchParams, linkedDataPromise }: { name: string, params: any, searchParams: any, linkedDataPromise: Promise<LinkedData> }) {
  const generateMetadata = await widgetMetadataGenerator(name);
  const linkedData = await linkedDataPromise;

  const { title, keywords } = generateMetadata({
    ...createWidgetContext('client', searchParams, linkedData),
    width: 0,
    height: 0,
  });

  const usp = new URLSearchParams(searchParams);
  const imageUsp = new URLSearchParams(usp);
  imageUsp.set('image_size', 'auto');

  return (
    <ShareBlock
      title={title ?? 'Untitled'}
      url={`${siteConfig.host}/widgets/${params.vendor}/${params.name}?${usp.toString()}`}
      thumbnailUrl={`${siteConfig.host}/widgets/${params.vendor}/${params.name}/thumbnail.png?${imageUsp.toString()}`}
      keywords={keywords}
    />
  );
}