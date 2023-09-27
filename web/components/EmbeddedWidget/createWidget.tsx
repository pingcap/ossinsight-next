import siteConfig from '@/site.config';
import { createDefaultComposeLayout, widgetMetadataGenerator, widgetVisualizer } from '@/utils/widgets';
import { ColorSchemeContext } from '@ossinsight/ui/src/components/ColorScheme/context';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import WidgetVisualization from '@ossinsight/widgets-core/src/renderer/react';
import { createVisualizationContext, createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
import { CSSProperties, forwardRef, useContext, useMemo } from 'react';

export async function createWidget (name: string) {
  const [
    visualizer,
    metadataGenerator,
  ] = await Promise.all([
    widgetVisualizer(name),
    widgetMetadataGenerator(name),
  ]);

  const Widget = forwardRef<HTMLDivElement, {
    className?: string;
    style?: CSSProperties;
    name: string;
    params: Record<string, string | string[]>;
    data: any;
    linkedData: LinkedData;
  }>(({
    className, style, name, data, linkedData, params,
  }, forwardedRef) => {
    const { colorScheme } = useContext(ColorSchemeContext);

    const dynamicHeight = useMemo(() => {
      return visualizer.computeDynamicHeight?.(data);
    }, [data]);

    const width = visualizer.width ?? siteConfig.sizes.default.width;
    const height =
      dynamicHeight ?? visualizer.height ?? siteConfig.sizes.default.height;

    const finalVisualizer = (() => {
      if (visualizer.type !== 'compose') {
        return createDefaultComposeLayout(name, data, {
          generateMetadata: metadataGenerator,
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

      return visualizer;
    })();

    return (
      <div ref={forwardedRef}>
        <WidgetVisualization
          className={className}
          style={style}
          type={finalVisualizer.type}
          visualizer={finalVisualizer}
          data={data}
          parameters={params}
          linkedData={linkedData}
          colorScheme={colorScheme}
        />
      </div>
    );
  });

  Widget.displayName = `Widget:${name}`;

  return Widget;
}
