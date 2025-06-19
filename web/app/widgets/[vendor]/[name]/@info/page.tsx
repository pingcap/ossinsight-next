import { makeLinkedData, widgetPageParams, WidgetPageProps, widgetSignature } from '@/app/widgets/[vendor]/[name]/utils';
import { ServerWidgetInfo } from '@/components/Widget/server/Info';
import { Suspense } from 'react';

export default async function InfoSection (props: WidgetPageProps) {
  const { name } = await widgetPageParams(props.params);
  const signature = await widgetSignature(props);
  const linkedData = makeLinkedData(name, props.searchParams);

  return (
    <Suspense key={signature} fallback="loading...">
      <ServerWidgetInfo name={name} linkedDataPromise={linkedData} searchParams={props.searchParams} />
    </Suspense>
  );
}
