import { VisualizeFunction, VisualizerModule } from '@ossinsight/widgets-types';
import { EChartsOption, EChartsType, init } from 'echarts';
import { useEffect, useRef } from 'react';
import * as colors from 'tailwindcss/colors';
import { LinkedData } from '../../parameters/resolver';
import  '../echarts-theme';

interface EChartsComponentProps {
  data: any;
  visualizer: VisualizeFunction<EChartsOption, any, any>;
  parameters: any;
  linkedData: LinkedData;
}

function EChartsComponent ({ data, visualizer, parameters, linkedData }: EChartsComponentProps) {
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

    const option = visualizer(data, {
      runtime: 'client',
      parameters,
      theme: { colors },
      width,
      height,
      getRepo (id: number): any {
        return linkedData.repos[String(id)];
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
    console.log(option);
  }, [data, visualizer, parameters]);


  return (
    <div
      className="WidgetContainer WidgetContainer-echarts"
      ref={containerRef}
    />
  );
}

export default EChartsComponent;
