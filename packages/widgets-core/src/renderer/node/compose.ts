import { createCanvas } from '@napi-rs/canvas';
import { visualizers } from '@ossinsight/widgets';
import { VisualizerModule, WidgetComposeItem } from '@ossinsight/widgets-types';
import { LinkedData } from '../../parameters/resolver';
import { createWidgetContext } from '../../utils/context';
import { renderCardHeader, renderLabelValue } from './builtin';
import render from './index';

export default async function renderCompose (width: number, height: number, dpr: number, visualizer: VisualizerModule<any, any, any, any>, data: any, parameters: any, linkedData: LinkedData) {
  width = visualizer.width ?? width;
  height = visualizer.height ?? height;
  let canvas = createCanvas(width * dpr, height * dpr);

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgb(31, 30, 40)';
  ctx.fillRect(0, 0, width * dpr, height * dpr);

  const option: WidgetComposeItem[] = visualizer.default(data, {
    width: width * dpr,
    height: height * dpr,
    dpr,
    ...createWidgetContext('server', parameters, linkedData),
  });
  let i = 0;

  for (let item of option) {
    switch (item.widget) {
      case 'builtin:label-value':
        renderLabelValue(canvas, {
          label: item.parameters.label,
          value: item.parameters.value,
          box: {
            dpr,
            left: item.left,
            top: item.top,
            width: item.width,
            height: item.height,
          },
        });
        continue;
      case 'builtin:card-heading':
        renderCardHeader(canvas, {
          title: item.parameters.title,
          subtitle: item.parameters.subtitle,
          box: {
            dpr,
            left: item.left,
            top: item.top,
            width: item.width,
            height: item.height,
          },
        });
        continue;
      default: {
        const visualizer = await visualizers[item.widget]();
        const subCanvas = await render({ width: item.width / dpr, height: item.height / dpr, dpr: dpr, visualizer, data: item.data, parameters: item.parameters, linkedData, type: visualizer.type });
        ctx.drawImage(subCanvas, item.left, item.top, item.width, item.height);
      }
    }
  }

  return canvas;
}