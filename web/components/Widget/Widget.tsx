'use client';

import { widgetVisualizer } from '@/utils/widgets';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { use } from 'react';
import WidgetVisualization from '../../../packages/widgets-core/src/renderer/react';

export default function Widget ({ name, params, data, linkedData }: { name: string, params: Record<string, string>, data: any, linkedData: LinkedData }) {
  const widget = use(widgetVisualizer(name));

  if (isEmptyData(data)) {
    return <p>Empty data</p>;
  }

  return (
    <WidgetVisualization type={widget.type} visualizer={widget.default} data={data} parameters={params} linkedData={linkedData} />
  );
}

function isEmptyData (data: any) {
  if (data instanceof Array) {
    return data.findIndex(item => item != null) == -1;
  } else {
    return data == null;
  }
}
