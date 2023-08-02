import { createCanvas, loadImage } from '@napi-rs/canvas';
import { VisualizerModule } from '@ossinsight/widgets-types';
import { LinkedData } from '../../parameters/resolver';
import { createWidgetContext } from '../../utils/context';

export default async function renderSvg (width: number, height: number, dpr: number, visualizer: VisualizerModule<any, any, any, any>, data: any, parameters: any, linkedData: LinkedData) {
  const option = visualizer.default(data, {
    width: width * dpr,
    height: width * dpr,
    ...createWidgetContext('server', parameters, linkedData),
  });

  // @ts-ignore
  const svg = await import('../../../node_modules/react-dom/server.node.js').then((module) => module.renderToString(option));
  const image = await loadImage(`data:image/svg+xml;base64,${btoa(svg)}`);

  width *= dpr;
  height *= dpr;

  let canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const aspectRatio = image.width / image.height;

  let imageWidth = image.width;
  let imageHeight = image.height;

  let padding = 16;

  imageWidth = width;

  if (imageWidth > width - padding * 2) {
    imageWidth = width - padding * 2;
    imageHeight = imageWidth / aspectRatio;
  }

  if (imageHeight > height - padding * 2) {
    imageHeight = height - padding * 2;
    imageWidth = imageHeight * aspectRatio;
  }

  ctx.save();
  ctx.fillStyle = 'rgb(27, 27, 29)';
  ctx.rect(0, 0, width, height);
  ctx.fill();
  ctx.restore();
  ctx.drawImage(image, padding + (width - imageWidth) / 2, padding + (height - imageHeight) / 2, imageWidth, imageHeight);

  return canvas.toBuffer('image/png');
}
