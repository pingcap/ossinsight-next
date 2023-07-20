import { VisualizeFunction } from '@ossinsight/widgets-types';
import { EChartsOption, EChartsType, init } from 'echarts';
import { useEffect, useRef } from 'react';
import * as colors from 'tailwindcss/colors';

interface EChartsComponentProps {
  data: any;
  visualizer: VisualizeFunction<EChartsOption, any, any>;
  parameters: any;
}

function EChartsComponent ({ data, visualizer, parameters }: EChartsComponentProps) {
  const echartsRef = useRef<EChartsType>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    echartsRef.current = init(containerRef.current!, null, {});
  }, []);

  useEffect(() => {
    const { clientWidth: width, clientHeight: height } = containerRef.current!;

    const option = visualizer(data, {
      runtime: 'client',
      parameters,
      theme: { colors },
      width,
      height,
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
      },
    });
    echartsRef.current!.setOption(option);
  }, [data, visualizer, parameters]);

  return (
    <div className="WidgetContainer WidgetContainer-echarts" ref={containerRef} />
  );
}

export default EChartsComponent;
