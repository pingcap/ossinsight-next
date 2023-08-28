'use client';

import siteConfig from '@/site.config';
import { createDefaultComposeLayout, widgetMetadataGenerator, widgetVisualizer } from '@/utils/widgets';
import { ColorSchemeSelector } from '@ossinsight/ui';
import { useColorScheme } from '@ossinsight/ui/src/components/ColorScheme';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createVisualizationContext, createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
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
  let visualizer = use(widgetVisualizer(name));
  const generateMetadata = use(widgetMetadataGenerator(name));
  const dynamicHeight = visualizer?.computeDynamicHeight?.(data);
  const { colorScheme, setColorScheme } = useColorScheme();

  const width = visualizer.width ?? siteConfig.sizes.default.width;
  const height = dynamicHeight ?? visualizer.height ?? siteConfig.sizes.default.height;

  if (visualizer.type !== 'compose') {
    visualizer = createDefaultComposeLayout(name, data, {
      generateMetadata,
      ctx: {
        ...createVisualizationContext({ width, height, dpr: devicePixelRatio, colorScheme }),
        ...createWidgetContext('client', params, linkedData),
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
      <div className="absolute right-4 top-8">
        <ColorSchemeSelector value={colorScheme} onValueChange={setColorScheme} />
      </div>
    </div>
  );
}
