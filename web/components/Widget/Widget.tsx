'use client';

import widgets from '@ossinsight/widgets';
import WidgetVisualization from '../../../packages/widgets-core/src/renderer/react';
import { use } from 'react';

export default function Widget ({ name, params, data }: { name: string, params: Record<string, string>, data: any }) {
  const widget = use(widgets[name]());

  return (
    <WidgetVisualization type={widget.type} visualizer={widget.default} data={data} parameters={params} />
  );
}