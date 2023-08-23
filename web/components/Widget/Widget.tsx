'use client';

import siteConfig from '@/site.config';
import { createDefaultComposeLayout, widgetMetadataGenerator, widgetVisualizer } from '@/utils/widgets';
import { ColorSchemeSelector } from '@ossinsight/ui';
import { useColorScheme } from '@ossinsight/ui/src/components/ColorScheme';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
import { CSSProperties, use, useState } from 'react';
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
  let visualizer = use(widgetVisualizer(name));
  const generateMetadata = use(widgetMetadataGenerator(name));
  const dynamicHeight = visualizer?.computeDynamicHeight?.(data);
  const { colorScheme, setColorScheme } = useColorScheme()

  if (hasEmptyData(data)) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <p>Whoops, failed to fetch data, refresh page or get back later.</p>
      </div>
    );
  }

  const width = visualizer.width ?? siteConfig.sizes.default.width;
  const height = dynamicHeight ?? visualizer.height ?? siteConfig.sizes.default.height;

  if (visualizer.type !== 'compose') {
    visualizer = createDefaultComposeLayout(name, data, {
      generateMetadata,
      ctx: {
        ...createWidgetContext('client', params, linkedData, colorScheme),
        width,
        height,
        dpr: devicePixelRatio,
      },
    });
  }

  return (
    <div
      className={'relative w-full h-full p-4 overflow-auto' + (!dynamicHeight ? ' flex items-center justify-center' : '') + ' ' + (colorScheme === 'light' ? 'bg-white' : 'bg-body')}
      style={{
        // background: 'radial-gradient(50.4% 48.07% at 50.4% 51.93%, #6760A4 0%, rgb(31,30,40) 100%)',
      }}
    >
      <div
        className="shadow-2xl rounded-xl max-w-full overflow-hidden"
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
          colorScheme={colorScheme}
        />
      </div>
      <div className='absolute right-4 top-4'>
        <ColorSchemeSelector value={colorScheme} onValueChange={setColorScheme} />
      </div>
    </div>
  );
}

function hasEmptyData (data: any) {
  if (data instanceof Array) {
    return data.findIndex(item => item != null) == -1;
  } else {
    return data == null;
  }
}
