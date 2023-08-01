import { Share } from '@/components/Share';
import { widgetParameterDefinitions } from '@/utils/widgets';
import { resolveParameters } from '@ossinsight/widgets-core/src/parameters/resolver';
import { Suspense } from 'react';
import type { WidgetPageProps } from '../utils';
import { widgetPageParams, widgetSignature } from '../utils';

export default async function ShareSection (props: WidgetPageProps) {
  const { name } = widgetPageParams(props.params);
  const signature = widgetSignature(props);
  const linkedData = widgetParameterDefinitions(name).then(paramDef => resolveParameters(paramDef, props.searchParams));

  return (
    <Suspense key={signature} fallback="loading...">
      <Share name={name} params={props.params} searchParams={props.searchParams} linkedDataPromise={linkedData} />
    </Suspense>
  );
}