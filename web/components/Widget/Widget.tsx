'use client';

import { ChartSkeleton } from '@ossinsight/ui/src/components/Skeleton';
import widgets from '@ossinsight/widgets';
import { cache, Suspense, use } from 'react';
import WidgetVisualization from '../../../packages/widgets-core/src/renderer/react';

export default function Widget ({ name, params, data }: { name: string, params: Record<string, string>, data: any }) {
  const widget = use(cache(widgets[name])());

  if (isEmptyData(data)) {
    return <p>Empty data</p>;
  }

  return (
    <Suspense fallback={<ChartSkeleton style={{ aspectRatio: '16 / 9' }} />}>
      <WidgetVisualization type={widget.type} visualizer={widget.default} data={data} parameters={params} />
    </Suspense>
  );
}

function isEmptyData (data: any) {
  if (data instanceof Array) {
    return data.findIndex(item => item != null) == -1;
  } else {
    return data == null;
  }
}
