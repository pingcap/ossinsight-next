import { createCanvas } from '@napi-rs/canvas';
import { VisualizerModule } from '@ossinsight/widgets-types';
import { init } from 'echarts';
import { LinkedData } from '../../parameters/resolver';
import { createWidgetContext } from '../../utils/context';
import '../echarts-theme';
import '../echarts-map';

export default function renderEcharts (width: number, height: number, dpr: number, visualizer: VisualizerModule<any, any, any, any>, data: any, parameters: any, linkedData: LinkedData, colorScheme?: string) {
  const dynamicHeight = visualizer.computeDynamicHeight?.(data);
  let canvas = createCanvas(width, dynamicHeight ?? height);

  const option = visualizer.default(data, {
    width: width,
    height: height,
    dpr,
    ...createWidgetContext('server', parameters, linkedData),
  });

  const echarts = init(canvas as any, colorScheme, {
    width: width,
    height: dynamicHeight ?? height,
    devicePixelRatio: dpr,
  });

  echarts.setOption({ ...option, animation: false });

  if (dynamicHeight) {
    const realCanvas = createCanvas(width * dpr, height * dpr);
    const ctx = realCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, width * dpr, height * dpr, 0, 0, width * dpr, height * dpr);
    canvas = realCanvas;
  }

  return canvas;
}
