'use client';

import widgets from '@ossinsight/widgets';
import { cache, use } from 'react';
import WidgetVisualization from '../../../packages/widgets-core/src/renderer/react';

export default function Widget ({ name, params, data }: { name: string, params: Record<string, string>, data: any }) {
  const widget = use(cache(widgets[name])());

  return (
    <WidgetVisualization type={widget.type} visualizer={widget.default} data={data} parameters={params} />
  );
}

