import { VisualizerModule } from '@ossinsight/widgets-types';
import { generateZoneOptions, PERIOD_OPTIONS } from '@ossinsight/widgets-utils/src/ui';
import { EChartsOption, EChartsType, init } from 'echarts';
import { useEffect, useRef } from 'react';
import * as colors from 'tailwindcss/colors';
import { LinkedData } from '../../parameters/resolver';
import { WidgetReactVisualizationProps } from '../../types';
import { createWidgetContext } from '../../utils/context';
import '../echarts-theme';

interface EChartsComponentProps extends WidgetReactVisualizationProps {
  data: any;
  visualizer: VisualizerModule<'echarts', EChartsOption, any, any>;
  parameters: any;
  linkedData: LinkedData;
}

function EChartsComponent ({ className, style, data, visualizer, parameters, linkedData }: EChartsComponentProps) {
  const echartsRef = useRef<EChartsType>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ec = echartsRef.current = init(containerRef.current!, 'dark', {});

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
    };
  }, []);

  useEffect(() => {
    const { clientWidth: width, clientHeight: height } = containerRef.current!;

    const option = visualizer.default(data, {
      width,
      height,
      ...createWidgetContext('client', parameters, linkedData),
    });
    echartsRef.current!.setOption(option);
  }, [data, visualizer, parameters]);

  return (
    <div
      className={className}
      style={style}
      ref={containerRef}
    />
  );
}

export default EChartsComponent;
