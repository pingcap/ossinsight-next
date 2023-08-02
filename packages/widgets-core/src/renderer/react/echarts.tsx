import { VisualizeFunction, VisualizerModule } from '@ossinsight/widgets-types';
import { EChartsOption, EChartsType, init } from 'echarts';
import { useEffect, useRef } from 'react';
import * as colors from 'tailwindcss/colors';
import { LinkedData } from '../../parameters/resolver';
import { WidgetReactVisualizationProps } from '../../types';
import { PERIOD_OPTIONS, generateZoneOptions } from '@ossinsight/widgets-utils/src/ui';
import '../echarts-theme';
import '../echarts-map';
import { createLinkedDataContext } from '../../utils/context';

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
      runtime: 'client',
      parameters,
      theme: { colors },
      width,
      height,
      ...createLinkedDataContext(linkedData),
      getTimeParams(): any {
        const { DEFAULT_ZONE } = generateZoneOptions();

        return {
          zone: parameters?.zone || DEFAULT_ZONE,
          period: parameters?.period || PERIOD_OPTIONS[0],
        };
      }
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
