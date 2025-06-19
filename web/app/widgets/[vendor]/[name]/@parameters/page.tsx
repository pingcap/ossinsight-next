import { getExcludeWidgetParameters, makeLinkedData, widgetPageParams, WidgetPageProps, widgetSignature } from '@/app/widgets/[vendor]/[name]/utils';
import { ServerParameters } from '@/components/Widget/server';
import { Suspense } from 'react';

export default async function ParametersSection (props: WidgetPageProps) {
  const { name } = await widgetPageParams(props.params);
  const signature = await widgetSignature(props);
  const linkedData = makeLinkedData(name, props.searchParams);

  const excludeParameters = getExcludeWidgetParameters(name);
  return (
    <Suspense key={signature} fallback="loading...">
      <ServerParameters name={name} linkedDataPromise={linkedData} excludeParameters={excludeParameters} />
    </Suspense>
  );
}
