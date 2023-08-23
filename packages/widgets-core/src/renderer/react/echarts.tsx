import { VisualizerModule } from '@ossinsight/widgets-types';
import { generateZoneOptions, PERIOD_OPTIONS } from '@ossinsight/widgets-utils/src/ui';
import { dispose, EChartsOption, EChartsType, init } from 'echarts';
import { useEffect, useRef } from 'react';
import * as colors from 'tailwindcss/colors';
import { LinkedData } from '../../parameters/resolver';
import { WidgetReactVisualizationProps } from '../../types';
import { createLinkedDataContext, createWidgetContext } from '../../utils/context';
import '../echarts-theme';
import '../echarts-map';

interface EChartsComponentProps extends WidgetReactVisualizationProps {
  data: any;
  visualizer: VisualizerModule<'echarts', EChartsOption, any, any>;
  parameters: any;
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
      ...createWidgetContext('client', parameters, linkedData),
      width,
      height,
      dpr: devicePixelRatio,
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
