import { getExcludeWidgetParameters, makeLinkedData, widgetPageParams, WidgetPageProps, widgetSignature } from '@/app/widgets/[vendor]/[name]/utils';
import { ServerParameters } from '@/components/Widget/server';
import { Suspense } from 'react';

export default function ParametersSection (props: WidgetPageProps) {
  const { name } = widgetPageParams(props.params);
  const signature = widgetSignature(props);
  const linkedData = makeLinkedData(name, props.searchParams);

  const excludeParameters = getExcludeWidgetParameters(name);
  return (
    <Suspense key={signature} fallback="loading...">
      <ServerParameters name={name} linkedDataPromise={linkedData} excludeParameters={excludeParameters} />
    </Suspense>
  );
}
