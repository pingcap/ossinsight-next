import Widget from '@/components/Widget';
import { WidgetProps } from '@/components/Widget/Widget';
import { widgetDatasourceFetcher, widgetParameterDefinitions } from '@/utils/widgets';
import { resolveExpressions } from '@ossinsight/widgets-core/src/parameters/resolveExpressions';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';

export interface ServerWidgetProps extends Omit<WidgetProps, 'linkedData' | 'data' | 'params'> {
  linkedDataPromise: Promise<LinkedData>;
  searchParams: any;
}

export async function ServerWidget ({ name, searchParams, linkedDataPromise, ...props }: ServerWidgetProps) {
  const fetcher = widgetDatasourceFetcher(name);
  const params = await widgetParameterDefinitions(name);

  const parameters = {
    ...searchParams,
    ...resolveExpressions(params),
  };

  const data = await fetcher({
    runtime: 'server',
    parameters,
  });

  return (
    <Widget name={name} params={parameters} data={data} linkedData={await linkedDataPromise} {...props} />
  );
}