'use client';
import * as React from 'react';
import Widget from '@/components/Widget';
import { WidgetProps } from '@/components/Widget/Widget';
import {
  widgetDatasourceFetcher,
  widgetParameterDefinitions,
} from '@/utils/widgets';
import { resolveExpressions } from '@ossinsight/widgets-core/src/parameters/resolveExpressions';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createWidgetBaseContext } from '@ossinsight/widgets-core/src/utils/context';
import Loader from '@/components/Widget/loading';

export interface ClientWidgetProps
  extends Omit<WidgetProps, 'linkedData' | 'data' | 'params'> {
  linkedDataPromise: Promise<LinkedData>;
  searchParams: Record<string, string | string[]>;
}

export function ClientWidget({
  name,
  searchParams,
  linkedDataPromise,
  ...props
}: ClientWidgetProps) {
  const [parameters, setParameters] = React.useState<any>();
  const [data, setData] = React.useState<any>();
  const [linkedData, setLinkedData] = React.useState<any>();

  React.useEffect(() => {
    const init = async () => {
      const fetcher = widgetDatasourceFetcher(name);
      const params = await widgetParameterDefinitions(name);

      const parameters = {
        ...searchParams,
        ...resolveExpressions(params),
      };

      const data = await fetcher(createWidgetBaseContext('server', parameters));

      const linkedData = await linkedDataPromise;

      setParameters(parameters);
      setData(data);
      setLinkedData(linkedData);
    };

    init();
  }, [name, searchParams, linkedDataPromise]);

  return (
    <>
      {parameters && data && linkedData ? (
        <Widget
          name={name}
          params={parameters}
          data={data}
          linkedData={linkedData}
          {...props}
        />
      ) : (
        <Loader />
      )}
    </>
  );
}
