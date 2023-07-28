import { widgetMetadataGenerator } from '@/utils/widgets';
import { ShareBlock } from '@ossinsight/ui/src/components/ShareBlock';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import * as colors from 'tailwindcss/colors';
import { PERIOD_OPTIONS, generateZoneOptions } from '@ossinsight/widgets-utils/src/ui';

const DOMAIN = 'https://ossinsight-next.vercel.app';

export default async function Share ({ name, params, searchParams, linkedDataPromise }: { name: string, params: any, searchParams: any, linkedDataPromise: Promise<LinkedData> }) {
  const generateMetadata = await widgetMetadataGenerator(name);
  const linkedData = await linkedDataPromise;

  const { title, keywords } = generateMetadata({
    theme: { colors },
    parameters: searchParams,
    runtime: 'server',
    width: 0,
    height: 0,
    getRepo (id: number): any {
      return linkedData.repos[String(id)];
    },
    getUser (id: number): any {
      return {};
    },
    getCollection (id: number): any {
      return {};
    },
    getOrg (id: number): any {
      return {};
    },
    getTimeParams(): any { 
      const { DEFAULT_ZONE } = generateZoneOptions();

      return {
        zone: searchParams?.zone || DEFAULT_ZONE,
        period: searchParams?.period || PERIOD_OPTIONS[0],
      };
    }
  });

  const usp = new URLSearchParams(searchParams);

  return (
    <ShareBlock
      title={title ?? 'Untitled'}
      url={`${DOMAIN}/widgets/${params.vendor}/${params.name}?${usp.toString()}`}
      thumbnailUrl={`${DOMAIN}/widgets/${params.vendor}/${params.name}/thumbnail.png?${usp.toString()}`}
      keywords={keywords}
    />
  );
}