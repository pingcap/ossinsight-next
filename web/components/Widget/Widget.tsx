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

  const width = visualizer.width ?? siteConfig.sizes.default.width;
  const height = dynamicHeight ?? visualizer.height ?? siteConfig.sizes.default.height;

  return (
    <div
      className={'w-full h-full p-4 overflow-auto' + (!dynamicHeight ? ' flex items-center justify-center' : '')}
      style={{
        // background: 'radial-gradient(50.4% 48.07% at 50.4% 51.93%, #6760A4 0%, rgb(31,30,40) 100%)',
      }}
    >
      <div
        className='shadow-2xl rounded-xl max-w-full overflow-hidden'
        style={{
          width,
          aspectRatio: `${width} / ${height}`,
          margin: !!dynamicHeight ? '0 auto' : undefined,
        }}
      >
        <WidgetVisualization
          className={dynamicHeight ? `Widget-dynamicHeight ${className}` : className}
          dynamicHeight={dynamicHeight}
          style={{
            ...style,
            aspectRatio: `${width} / ${height}`,
          }}
          type={visualizer.type}
          visualizer={visualizer}
          data={data}
          parameters={params}
          linkedData={linkedData}
        />
      </div>
    </div>
  );
}

function isEmptyData (data: any) {
  if (data instanceof Array) {
    return data.findIndex(item => item != null) == -1;
  } else {
    return data == null;
  }
}
