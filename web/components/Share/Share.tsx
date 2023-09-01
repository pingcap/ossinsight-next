import { createShareInfo } from '@/components/Share/utils';
import { ShareBlock } from '@ossinsight/ui/src/components/ShareBlock';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';

export async function Share ({ name, params, searchParams, linkedDataPromise }: { name: string, params: any, searchParams: any, linkedDataPromise: Promise<LinkedData> }) {
  const shareInfo = await createShareInfo(name, await linkedDataPromise, searchParams);

  return (
    <ShareBlock
      {...shareInfo}
      themedImage={params.name.startsWith('compose-')}
    />
  );
}