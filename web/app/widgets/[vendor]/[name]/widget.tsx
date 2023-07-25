import Widget from '@/components/Widget';
import { widgetDatasourceFetcher } from '@/utils/widgets';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';

export default async function ServerWidget ({ name, searchParams, linkedDataPromise }: { name: string, searchParams: any, linkedDataPromise: Promise<LinkedData> }) {
  const fetcher = widgetDatasourceFetcher(name);

  const data = await fetcher({
    runtime: 'server',
    parameters: searchParams,
  });

  return (
    <Widget name={name} params={searchParams} data={data} linkedData={await linkedDataPromise} />
  );
}