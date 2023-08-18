import { createCanvas } from '@napi-rs/canvas';
import { visualizers } from '@ossinsight/widgets';
import { VisualizerModule, WidgetComposeItem } from '@ossinsight/widgets-types';
import { LinkedData } from '../../parameters/resolver';
import { createWidgetContext } from '../../utils/context';
import { renderAvatarLabel, renderCardHeader, renderLabelValue } from './builtin';
import render from './index';

export default async function renderCompose (width: number, height: number, dpr: number, visualizer: VisualizerModule<any, any, any, any>, data: any, parameters: any, linkedData: LinkedData, colorScheme?: string) {
  width = (visualizer.width ?? width);
  height = (visualizer.height ?? height);
  let canvas = createCanvas((width + 16) * dpr, (height + 16) * dpr);
  const offX = 8 * dpr;
  const offY = 8 * dpr;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = colorScheme === 'light' ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, width * dpr, height * dpr);

  ctx.fillStyle = colorScheme === 'light' ? '#ffffff' : 'rgb(36, 35, 49)';
  ctx.save();
  ctx.shadowColor = colorScheme === 'light' ? 'rgba(219, 216, 199, 0.75)' : 'rgba(36, 39, 56, 0.25)';
  ctx.shadowOffsetY = 4 * dpr;
  ctx.shadowBlur = 4 * dpr;
  ctx.beginPath();
  ctx.moveTo(offX, offY)
  ctx.roundRect(offX, offY, width * dpr, height * dpr, 12 * dpr);
  ctx.fill();
  ctx.restore();

  const option: WidgetComposeItem[] = visualizer.default(data, {
    width: width * dpr,
    height: height * dpr,
    dpr,
    ...createWidgetContext('server', parameters, linkedData),
  });

  const all = option.map(async (item) => {
    switch (item.widget) {
      case 'builtin:label':
      case 'builtin:label-value':
        renderLabelValue(canvas, {
          colorScheme,
          label: item.parameters.label,
          value: item.parameters.value,
          box: {
            dpr,
            left: offX + item.left,
            top: offY + item.top,
            width: item.width,
            height: item.height,
          },
        });
        break;
      case 'builtin:card-heading':
        renderCardHeader(canvas, {
          colorScheme,
          title: item.parameters.title,
          subtitle: item.parameters.subtitle,
          box: {
            dpr,
            left: offX + item.left,
            top: offY + item.top,
            width: item.width,
            height: item.height,
          },
        });
        break;
      case 'builtin:avatar-label':
        await renderAvatarLabel(canvas, {
          colorScheme,
          label: item.parameters.label,
          imgSrc: item.parameters.imgSrc,
          box: {
            dpr,
            left: offX + item.left,
            top: offY + item.top,
            width: item.width,
            height: item.height,
          },
        });
        break;
      default: {
        const visualizer = await visualizers[item.widget]();
        const subCanvas = await render({ width: item.width / dpr, height: item.height / dpr, dpr: dpr, visualizer, data: item.data, parameters: item.parameters, linkedData, type: visualizer.type, colorScheme });
        ctx.drawImage(subCanvas, offX + item.left, offY + item.top, item.width, item.height);
      }
    }
  });

  await Promise.all(all);

  return canvas;
}