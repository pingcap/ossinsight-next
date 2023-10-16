import { createDefaultComposeLayout, widgetMetadataGenerator, widgetVisualizer } from '@/utils/widgets';
import { ColorSchemeContext } from '@ossinsight/ui/src/components/ColorScheme/context';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import WidgetVisualization from '@ossinsight/widgets-core/src/renderer/react';
import { createVisualizationContext, createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
import { CSSProperties, forwardRef, ForwardRefExoticComponent, lazy, LazyExoticComponent, RefAttributes, useContext, useMemo } from 'react';

interface WidgetProps {
  className?: string;
  style?: CSSProperties;
  name: string;
  params: Record<string, string | string[]>;
  data: any;
  linkedData: LinkedData;
}

// FIXME
const dirtyWidgetsMap = new Map<string, LazyExoticComponent<ForwardRefExoticComponent<WidgetProps & RefAttributes<HTMLDivElement>>>>;

export function useWidget (name: string) {
  const cached = dirtyWidgetsMap.get(name);
  if (cached) {
    return cached;
  } else {
    const Widget = lazy(() => createWidget(name).then(Widget => ({ default: Widget })));
    dirtyWidgetsMap.set(name, Widget);
    return Widget;
  }
}

async function createWidget (name: string) {
  const [
    visualizer,
    metadataGenerator,
  ] = await Promise.all([
    widgetVisualizer(name),
    widgetMetadataGenerator(name),
  ]);

  const Widget = forwardRef<HTMLDivElement, WidgetProps>(({
    className, style, name, data, linkedData, params,
  }, forwardedRef) => {
    const { colorScheme } = useContext(ColorSchemeContext);

    const dynamicHeight = useMemo(() => {
      return visualizer.computeDynamicHeight?.(data);
    }, [data]);

    const width = visualizer.width ?? 0;
    const height =
      dynamicHeight ?? visualizer.height ?? 0;

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
      <WidgetVisualization
        noSuspense
        className={className}
        style={style}
        type={finalVisualizer.type}
        visualizer={finalVisualizer}
        data={data}
        parameters={params}
        linkedData={linkedData}
        colorScheme={colorScheme}
        ref={forwardedRef}
      />
    );
  });

  Widget.displayName = `Widget:${name}`;

  return Widget;
}
