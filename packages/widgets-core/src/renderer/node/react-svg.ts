import { createCanvas, loadImage } from '@napi-rs/canvas';
import { VisualizerModule } from '@ossinsight/widgets-types';
import { LinkedData } from '../../parameters/resolver';
import { createWidgetContext } from '../../utils/context';
import { scaleToFit } from '../../utils/vis';

export default async function renderSvg (width: number, height: number, dpr: number, visualizer: VisualizerModule<any, any, any, any>, data: any, parameters: any, linkedData: LinkedData, colorScheme?: string) {
  width = visualizer.width ?? width;
  height = visualizer.height ?? height;

  const option = visualizer.default(data, {
    width: width,
    height: height,
    dpr,
    ...createWidgetContext('server', parameters, linkedData),
  });

  // @ts-ignore
  const svg = await import('../../../node_modules/react-dom/server.node.js').then((module) => module.renderToString(option));
  const image = await loadImage(`data:image/svg+xml;base64,${btoa(svg)}`);

  width *= dpr;
  height *= dpr;

  let canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const { width: imageWidth, height: imageHeight } = scaleToFit(image.width, image.height, width, height);

  ctx.save();
  ctx.fillStyle = colorScheme === 'light' ? 'white' : 'rgb(31, 30, 40)';
  ctx.rect(0, 0, width, height);
  ctx.fill();
  ctx.restore();
  ctx.drawImage(image, (width - imageWidth) / 2, (height - imageHeight) / 2, imageWidth, imageHeight);

  return canvas;
}
