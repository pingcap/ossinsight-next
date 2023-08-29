'use client';

import siteConfig from '@/site.config';
import {
  createDefaultComposeLayout,
  widgetMetadataGenerator,
  widgetVisualizer,
} from '@/utils/widgets';
import { ColorSchemeSelector } from '@ossinsight/ui';
import { useColorScheme } from '@ossinsight/ui/src/components/ColorScheme';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import {
  createVisualizationContext,
  createWidgetContext,
} from '@ossinsight/widgets-core/src/utils/context';
import { CSSProperties, use } from 'react';
import clsx from 'clsx';
import WidgetVisualization from '../../../packages/widgets-core/src/renderer/react';

export interface WidgetProps {
  className?: string;
  style?: CSSProperties;
  name: string;
  params: Record<string, string>;
  data: any;
  linkedData: LinkedData;
  showShadow?: boolean;
  showThemeSwitch?: boolean;
  dense?: boolean;
}

export default function Widget({
  className,
  style,
  name,
  params,
  data,
  linkedData,
  showShadow = true,
  showThemeSwitch = true,
  dense = false,
}: WidgetProps) {
  let visualizer = use(widgetVisualizer(name));
  const generateMetadata = use(widgetMetadataGenerator(name));
  const dynamicHeight = visualizer?.computeDynamicHeight?.(data);
  const { colorScheme, setColorScheme } = useColorScheme();

  const width = visualizer.width ?? siteConfig.sizes.default.width;
  const height =
    dynamicHeight ?? visualizer.height ?? siteConfig.sizes.default.height;

  if (visualizer.type !== 'compose') {
    visualizer = createDefaultComposeLayout(name, data, {
      generateMetadata,
      ctx: {
        ...createVisualizationContext({
          width,
          height,
          dpr: devicePixelRatio,
          colorScheme,
        }),
        ...createWidgetContext('client', params, linkedData),
      },
    });
  }

  return (
    <div
      className={clsx('relative w-full h-fulloverflow-auto', {
        ['flex items-center justify-center']: !dynamicHeight,
        'bg-white': colorScheme === 'light',
        'bg-body': colorScheme !== 'light',
        'p-4': !dense,
      })}
      style={
        {
          // background: 'radial-gradient(50.4% 48.07% at 50.4% 51.93%, #6760A4 0%, rgb(31,30,40) 100%)',
        }
      }
    >
      <div
        className={clsx('rounded-xl max-w-full overflow-hidden', {
          ['shadow-2xl']: showShadow,
        })}
        style={{
          width,
          aspectRatio: `${width} / ${height}`,
          margin: !!dynamicHeight ? '0 auto' : undefined,
        }}
      >
        <WidgetVisualization
          className={
            dynamicHeight ? `Widget-dynamicHeight ${className}` : className
          }
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
      {showThemeSwitch && (
        <div className='absolute right-4 top-8'>
          <ColorSchemeSelector
            value={colorScheme}
            onValueChange={setColorScheme}
          />
        </div>
      )}
    </div>
  );
}
