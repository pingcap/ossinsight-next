import { createCanvas, type Canvas } from '@napi-rs/canvas';

export type WordCloudLayoutWord = { x?: number; y?: number; text: string; size: number; rotate?: number; font?: string };

/**
 * Renders word cloud thumbnail by drawing layout words on canvas (no React).
 * Avoids React version mismatch when using react-dom/server.renderToString.
 */
export async function renderWordCloudThumbnail (
  getWordCloudLayout: (input: unknown, ctx: Record<string, unknown>) => Promise<WordCloudLayoutWord[]>,
  data: unknown,
  ctx: {
    width: number;
    height: number;
    dpr: number;
    colorScheme?: string;
    theme?: { colorScheme?: string };
    [key: string]: unknown;
  },
): Promise<Canvas> {
  const canvasWidth = ctx.width * ctx.dpr;
  const canvasHeight = ctx.height * ctx.dpr;
  const layoutCtx = {
    ...ctx,
    width: canvasWidth,
    height: canvasHeight,
    runtime: 'server' as const,
    createCanvas: () => createCanvas(1, 1) as unknown as HTMLCanvasElement,
  };
  const words = await getWordCloudLayout(data, layoutCtx);
  const canvas = createCanvas(canvasWidth, canvasHeight) as Canvas;
  const c = canvas.getContext('2d');
  const colorScheme = ctx.colorScheme ?? ctx.theme?.colorScheme ?? 'dark';
  const bg = colorScheme === 'light' ? 'white' : 'rgb(36, 35, 49)';
  c.fillStyle = bg;
  c.fillRect(0, 0, canvasWidth, canvasHeight);
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  const fillColor = '#dd6b66';
  const fontFamily = 'Heiti TC';
  for (const word of words) {
    const x = (word.x ?? 0) + cx;
    const y = (word.y ?? 0) + cy;
    const rot = (word.rotate ?? 0) * (Math.PI / 180);
    const size = word.size ?? 12;
    const font = word.font ?? fontFamily;
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    c.font = `${size}px ${font}`;
    c.fillStyle = fillColor;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(word.text, 0, 0);
    c.restore();
  }
  return canvas;
}
