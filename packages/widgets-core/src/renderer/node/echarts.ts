import { createCanvas } from '@napi-rs/canvas';
import { EChartsVisualizationConfig, VisualizeFunction } from '@ossinsight/widgets-types';
import { init } from 'echarts';
import * as colors from 'tailwindcss/colors';
import { LinkedData } from '../../parameters/resolver';

export default function renderEcharts (width: number, height: number, dpr: number, visualizer: VisualizeFunction<EChartsVisualizationConfig, any, any>, data: any, parameters: any, linkedData: LinkedData) {
  const canvas = createCanvas(width, height);

  const option = visualizer(data, {
    parameters,
    theme: { colors },
    runtime: 'server',
    width: width * dpr,
    height: width * dpr,
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

  const echarts = init(canvas as any, 'dark', {
    width: width,
    height: height,
    devicePixelRatio: dpr,
  });

  echarts.setOption({ ...option, animation: false });

  return canvas.toBuffer('image/png');
}
