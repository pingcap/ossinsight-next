import { createCanvas } from '@napi-rs/canvas';
import { VisualizerModule } from '@ossinsight/widgets-types';
import { generateZoneOptions, PERIOD_OPTIONS } from '@ossinsight/widgets-utils/src/ui';
import { init } from 'echarts';
import * as colors from 'tailwindcss/colors';
import { LinkedData } from '../../parameters/resolver';
import '../echarts-theme';

export default function renderEcharts (width: number, height: number, dpr: number, visualizer: VisualizerModule<any, any, any, any>, data: any, parameters: any, linkedData: LinkedData) {
  const dynamicHeight = visualizer.computeDynamicHeight?.(data);
  let canvas = createCanvas(width, dynamicHeight ?? height);

  const option = visualizer.default(data, {
    parameters,
    theme: { colors },
    runtime: 'server',
    width: width * dpr,
    height: width * dpr,
    getRepo (id: number): any {
      return linkedData.repos[String(id)];
    },
    getUser (id: number): any {
      return linkedData.users[String(id)];
    },
    getCollection (id: number): any {
      return linkedData.collections[String(id)];
    },
    getOrg (id: number): any {
      return {};
    },
    getTimeParams (): any {
      const { DEFAULT_ZONE } = generateZoneOptions();

      return {
        zone: parameters?.zone || DEFAULT_ZONE,
        period: parameters?.period || PERIOD_OPTIONS[0],
      };
    },
  });

  const echarts = init(canvas as any, 'dark', {
    width: width,
    height: dynamicHeight ?? height,
    devicePixelRatio: dpr,
  });

  echarts.setOption({ ...option, animation: false });

  if (dynamicHeight) {
    const realCanvas = createCanvas(width, height);
    const ctx = realCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, width * dpr, height* dpr, 0, 0, width, height);
    canvas = realCanvas;
  }

  return canvas.toBuffer('image/png');
}
