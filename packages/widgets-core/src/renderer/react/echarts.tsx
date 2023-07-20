import { VisualizeFunction } from '@ossinsight/widgets-types';
import { EChartsOption, EChartsType, init } from 'echarts';
import { useEffect, useMemo, useRef } from 'react';
import * as colors from 'tailwindcss/colors';

interface EChartsComponentProps {
  data: any;
  visualizer: VisualizeFunction<EChartsOption, any, any>;
  parameters: any;
}

function EChartsComponent ({ data, visualizer, parameters }: EChartsComponentProps) {
  const echartsRef = useRef<EChartsType>();
  const containerRef = useRef<HTMLDivElement>(null);

  const option = useMemo(() => {
    return visualizer(data, {
      runtime: 'client',
      parameters,
      theme: { colors },
      getRepo (id: number): any {
        return {};
      },
      getUser (id: number): any {
        return {};
      },
      getCollection (id: number): any {
        return {};
      },
      getOrg (id: number): any {
        return {};
      }
    });
  }, [data, visualizer, parameters]);

  useEffect(() => {
    echartsRef.current = init(containerRef.current!, null, {});
  }, []);

  useEffect(() => {
    echartsRef.current!.setOption(option);
  }, [option]);

  return (
    <div className="WidgetContainer WidgetContainer-echarts" ref={containerRef} />
  );
}

export default EChartsComponent;
