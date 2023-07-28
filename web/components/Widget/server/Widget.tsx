import Widget from '@/components/Widget';
import { WidgetProps } from '@/components/Widget/Widget';
import { widgetDatasourceFetcher } from '@/utils/widgets';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';

export interface ServerWidgetProps extends Omit<WidgetProps, 'linkedData' | 'data' | 'params'> {
  linkedDataPromise: Promise<LinkedData>;
  searchParams: any;
}

export async function ServerWidget ({ name, searchParams, linkedDataPromise, ...props }: ServerWidgetProps) {
  const fetcher = widgetDatasourceFetcher(name);

  const data = await fetcher({
    runtime: 'server',
    parameters: searchParams,
  });

  return (
    <Widget name={name} params={searchParams} data={data} linkedData={await linkedDataPromise} {...props} />
  );
}