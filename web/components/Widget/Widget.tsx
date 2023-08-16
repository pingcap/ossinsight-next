'use client';

import siteConfig from '@/site.config';
import { widgetVisualizer } from '@/utils/widgets';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { CSSProperties, use } from 'react';
import WidgetVisualization from '../../../packages/widgets-core/src/renderer/react';

export interface WidgetProps {
  className?: string,
  style?: CSSProperties,
  name: string,
  params: Record<string, string>,
  data: any,
  linkedData: LinkedData
}

export default function Widget ({ className, style, name, params, data, linkedData }: WidgetProps) {
  const visualizer = use(widgetVisualizer(name));
  const dynamicHeight = visualizer?.computeDynamicHeight?.(data);

  if (isEmptyData(data)) {
    return <p>Empty data</p>;
  }

  return (
    <WidgetVisualization
      className={dynamicHeight ? `Widget-dynamicHeight ${className}` : className}
      width={siteConfig.sizes.default.width}
      height={siteConfig.sizes.default.height}
      dynamicHeight={dynamicHeight}
      style={style}
      type={visualizer.type}
      visualizer={visualizer}
      data={data}
      parameters={params}
      linkedData={linkedData}
    />
  );
}

function isEmptyData (data: any) {
  if (data instanceof Array) {
    return data.findIndex(item => item != null) == -1;
  } else {
    return data == null;
  }
}
