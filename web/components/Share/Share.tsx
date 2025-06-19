import { createShareInfo } from '@/components/Share/utils';
import { ShareBlock } from '@ossinsight/ui/src/components/ShareBlock';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';

export async function Share ({ name, params, searchParams, linkedDataPromise }: { name: string, params: Promise<any>, searchParams: Promise<Record<string, string | string[]>>, linkedDataPromise: Promise<LinkedData> }) {
  const shareInfo = await createShareInfo(name, await linkedDataPromise, searchParams);

  return (
    <ShareBlock
      {...shareInfo}
      themedImage={(await params).name.startsWith('compose-')}
    />
  );
}