import { Canvas, loadImage } from '@napi-rs/canvas';

type BuiltinProps<P> = {
  box: {
    dpr: number
    left: number
    top: number
    width: number
    height: number
  }
} & P

export function renderCardHeader (canvas: Canvas, props: BuiltinProps<{ title: string, subtitle: string }>) {
  const { subtitle, box: { left, height, top, width, dpr }, title } = props;

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = 'none';
  ctx.textBaseline = 'middle';

  ctx.textAlign = 'start';
  ctx.font = `bold ${14 * dpr}px`;
  ctx.fillStyle = 'rgb(193,193,193)';
  ctx.fillText(title, left, top + height / 2, width);

  ctx.textAlign = 'end';
  ctx.font = `normal italic ${12 * dpr}px`;
  ctx.fillStyle = 'rgb(124,124,124)';
  ctx.fillText(subtitle, left + width, top + height / 2, width);

  ctx.restore();
}

export function renderLabelValue (canvas: Canvas, props: BuiltinProps<{ label: string, value: string }>) {
  const { label, box: { dpr, left, height, top, width }, value } = props;

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = 'none';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';

  ctx.font = `normal ${12 * dpr}px`;
  ctx.fillStyle = 'white';
  ctx.fillText(label, left, top, width);

  const measured = ctx.measureText(label);
  const fontHeight = measured.fontBoundingBoxAscent + measured.fontBoundingBoxDescent;

  ctx.font = `bold ${24 * dpr}px`;
  ctx.fillStyle = 'white';
  ctx.fillText(String(value), left, top + fontHeight + 4 * dpr, width);

  ctx.restore();
}

export async function renderAvatarLabel(
  canvas: Canvas,
  props: BuiltinProps<{ label: string; imgSrc: string }>
) {
  const {
    label,
    box: { dpr, left, height, top, width },
    imgSrc,
  } = props;

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = 'none';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';

  ctx.font = `normal ${12 * dpr}px`;
  ctx.fillStyle = 'white';
  ctx.fillText(label, left + 30 * dpr, top + 7 * dpr, width);

  const buffer = await fetch(imgSrc).then((res) => res.arrayBuffer());
  console.log(`imgSrc`, imgSrc);
  const avatar = await loadImage(buffer, {
    alt: 'label',
  });
  ctx.drawImage(avatar, left, top + 2 * dpr, 20 * dpr, 20 * dpr);

  ctx.restore();
}

