import { getOrigin } from '@/components/Share/utils';
import { widgetMetadataGenerator } from '@/utils/widgets';
import { ShareBlock } from '@ossinsight/ui/src/components/ShareBlock';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';

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

  const origin = getOrigin();

  return (
    <ShareBlock
      title={title ?? 'Untitled'}
      url={`${origin}/widgets/${params.vendor}/${params.name}?${usp.toString()}`}
      thumbnailUrl={`${origin}/widgets/${params.vendor}/${params.name}/thumbnail.png?${imageUsp.toString()}`}
      keywords={keywords}
    />
  );
}