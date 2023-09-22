import { VisualizerModule } from '@ossinsight/widgets-types';
import { dispose, EChartsOption, EChartsType, init } from 'echarts';
import { useEffect, useRef } from 'react';
import { LinkedData } from '../../parameters/resolver';
import { WidgetReactVisualizationProps } from '../../types';
import { createVisualizationContext, createWidgetContext } from '../../utils/context';
import '../echarts-map';
import '../echarts-theme';

interface EChartsComponentProps extends WidgetReactVisualizationProps {
  data: any;
  visualizer: VisualizerModule<'echarts', EChartsOption, any, any>;
  parameters: Record<string, string | string[]>;
  linkedData: LinkedData;
}

function EChartsComponent ({ className, style, data, visualizer, parameters, linkedData, colorScheme }: EChartsComponentProps) {
  const echartsRef = useRef<EChartsType>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ec = echartsRef.current = init(containerRef.current!, colorScheme === 'auto' ? 'dark' : colorScheme, {});

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      ec.resize({
        width,
        height,
      });
    });
    ro.observe(containerRef.current!);
    return () => {
      ro.disconnect();
      dispose(ec);
    };
  }, [colorScheme]);

  useEffect(() => {
    const { clientWidth: width, clientHeight: height } = containerRef.current!;

    const option = visualizer.default(data, {
      ...createVisualizationContext({ width, height, dpr: devicePixelRatio, colorScheme }),
      ...createWidgetContext('client', parameters, linkedData),
    });
    echartsRef.current!.setOption(option);
  }, [data, visualizer, parameters, colorScheme]);

  return (
    <div
      className={className}
      style={style}
      ref={containerRef}
    />
  );
}

export default EChartsComponent;
