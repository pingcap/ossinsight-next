import { createCanvas } from '@napi-rs/canvas';
import { visualizers } from '@ossinsight/widgets';
import { VisualizerModule, WidgetComposeItem } from '@ossinsight/widgets-types';
import { LinkedData } from '../../parameters/resolver';
import { createWidgetContext } from '../../utils/context';
import { renderAvatarLabel, renderCardHeader, renderEmpty, renderLabelValue } from './builtin';
import render from './index';

/**
 *
 * @param width
 * @param height
 * @param dpr
 * @param visualizer
 * @param data
 * @param parameters
 * @param linkedData
 * @param colorScheme
 * @param sizeName
 * @param root indicate that the widget is a real compose type widget.
 */
export default async function renderCompose (width: number, height: number, dpr: number, visualizer: VisualizerModule<any, any, any, any>, data: any, parameters: any, linkedData: LinkedData, colorScheme?: string, sizeName?: string, root = false) {
  // should wrap with shadow box if the widget is 'compose' type or the rendering context is not twitter.
  const shouldWrap = !!(root || sizeName !== 'twitter:summary_large_image');

  width = (visualizer.width ?? width);
  height = (visualizer.height ?? height);
  const canvasWidth = (width + (shouldWrap ? 16 : 0)) * dpr;
  const canvasHeight = (height + (shouldWrap ? 16 : 0)) * dpr;

  let canvas = createCanvas(canvasWidth, canvasHeight);
  const offX = shouldWrap ? 8 * dpr : 0;
  const offY = shouldWrap ?  8 * dpr : 0;

  const ctx = canvas.getContext('2d');

  if (shouldWrap) {
    ctx.fillStyle = colorScheme === 'light' ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, width * dpr, height * dpr);

    ctx.fillStyle = colorScheme === 'light' ? '#ffffff' : 'rgb(36, 35, 49)';
    ctx.save();
    ctx.shadowColor = colorScheme === 'light' ? 'rgba(219, 216, 199, 0.75)' : 'rgba(36, 39, 56, 0.25)';
    ctx.shadowOffsetY = 4 * dpr;
    ctx.shadowBlur = 4 * dpr;
    ctx.beginPath();
    ctx.moveTo(offX, offY);
    ctx.roundRect(offX, offY, width * dpr, height * dpr, 12 * dpr);
    ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = colorScheme === 'light' ? 'rgba(255,255,255,0)' : 'rgb(36, 35, 49)';
    ctx.fillRect(0, 0, width * dpr, height * dpr);
  }

  const option: WidgetComposeItem[] = visualizer.default(data, {
    width: width * dpr,
    height: height * dpr,
    dpr,
    ...createWidgetContext('server', parameters, linkedData),
  });

  const all = option.map(async (item) => {
    const left = offX + item.left;
    const top = offY + item.top;
    const width = item.width;
    const height = item.height;
    const box = { left, top, width, height, dpr };
    switch (item.widget) {
      case 'builtin:label':
      case 'builtin:label-value':
        renderLabelValue(canvas, {
          colorScheme,
          label: item.parameters.label,
          value: item.parameters.value,
          box,
        });
        break;
      case 'builtin:card-heading':
        renderCardHeader(canvas, {
          colorScheme,
          title: item.parameters.title,
          subtitle: item.parameters.subtitle,
          box,
        });
        break;
      case 'builtin:avatar-label':
        await renderAvatarLabel(canvas, {
          colorScheme,
          label: item.parameters.label,
          imgSrc: item.parameters.imgSrc,
          size: item.parameters.size,
          box,
        });
        break;
      case 'builtin:empty':
        await renderEmpty(canvas, { box })
        break;
      default: {
        const visualizer = await visualizers[item.widget]();
        const subCanvas = await render({ width: item.width / dpr, height: item.height / dpr, dpr: dpr, visualizer, data: item.data, parameters: item.parameters, linkedData, type: visualizer.type, colorScheme });
        ctx.drawImage(subCanvas, offX + item.left, offY + item.top, item.width, item.height);
      }
    }
  });

  await Promise.all(all);

  if (sizeName === 'twitter:summary_large_image' && root) {
    const twitterCanvas = createCanvas(800, 418);
    let idealWidth = canvas.width;
    let idealHeight = canvas.height;

    if (idealWidth > 800) {
      idealHeight *= 800 / idealWidth;
      idealWidth = 800;
    }

    if (idealHeight > 418) {
      idealWidth *= 418 / idealHeight;
      idealHeight = 418;
    }

    const tCtx = twitterCanvas.getContext('2d');
    tCtx.fillStyle = 'rgb(31, 30, 40)';
    tCtx.beginPath();
    tCtx.rect(0, 0, 800, 418);
    tCtx.fill();
    tCtx.restore();

    const y = (418 - idealHeight) / 2;
    const x = (800 - idealWidth) / 2;

    tCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, x, y, idealWidth, idealHeight);
    return twitterCanvas;
  } else {
    return canvas;
  }
}