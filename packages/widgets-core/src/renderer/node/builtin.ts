import { Canvas, loadImage, Path2D } from '@napi-rs/canvas';
import { getTheme, themed } from '../../utils/theme';

type BuiltinProps<P> = {
  colorScheme: string
  box: {
    dpr: number;
    left: number;
    top: number;
    width: number;
    height: number;
  };
} & P;

export function renderCardHeader(
  canvas: Canvas,
  props: BuiltinProps<{ title: string; subtitle?: string }>
) {
  const {
    subtitle,
    box: { left, height, top, width, dpr },
    title,
  } = props;

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = 'none';
  ctx.textBaseline = 'middle';

  const { CardHeader } = getTheme(props.colorScheme);

  if (subtitle) {
    ctx.textAlign = 'start';
    ctx.font = `bold ${14 * dpr}px`;
    ctx.fillStyle = CardHeader.titleColor;
    ctx.fillText(title, left, top + height / 2, width);

    ctx.textAlign = 'end';
    ctx.font = `normal italic ${12 * dpr}px`;
    ctx.fillStyle = CardHeader.subtitleColor;
    ctx.fillText(subtitle, left + width, top + height / 2, width);
  } else {
    ctx.textAlign = 'center';
    ctx.font = `bold ${14 * dpr}px`;
    ctx.fillStyle = CardHeader.subtitleColor;
    ctx.fillText(title, left + width / 2, top + height / 2, width);
  }


  ctx.restore();
}

export function renderLabelValue(
  canvas: Canvas,
  props: BuiltinProps<{ label: string; value?: string }>
) {
  const {
    label,
    box: { dpr, left, height, top, width },
    value,
  } = props;

  const { Label, Value } = getTheme(props.colorScheme);

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = 'none';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';

  ctx.font = `normal ${12 * dpr}px`;
  ctx.fillStyle = Label.color;
  ctx.fillText(label, left, top, width);

  const measured = ctx.measureText(label);
  const fontHeight =
    measured.fontBoundingBoxAscent + measured.fontBoundingBoxDescent;

  ctx.font = `bold ${24 * dpr}px`;
  ctx.fillStyle = Value.color;
  value && ctx.fillText(String(value), left, top + fontHeight + 4 * dpr, width);

  ctx.restore();
}

export async function renderAvatarLabel(
  canvas: Canvas,
  props: BuiltinProps<{ label?: string; imgSrc: string; size?: number }>
) {
  const {
    label = '',
    box: { dpr, left, height, top, width },
    imgSrc,
    size = 20,
  } = props;

  const { Label, Avatar } = getTheme(props.colorScheme);

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = 'none';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';

  ctx.font = `normal ${12 * dpr}px`;
  ctx.fillStyle = Label.color;
  label && ctx.fillText(label, left + 30 * dpr, top + 7 * dpr, width);

  try {
    const buffer = await fetch(imgSrc, { cache: 'force-cache' }).then((res) =>
      res.arrayBuffer()
    );
    const avatar = await loadImage(buffer, {
      alt: 'label',
    });
    let circlePath = new Path2D();
    circlePath.arc(
      left + (size / 2) * dpr,
      top + (size / 2 + 2) * dpr,
      (size / 2) * dpr,
      0,
      2 * Math.PI
    );
    ctx.clip(circlePath);
    ctx.drawImage(avatar, left, top + 2 * dpr, size * dpr, size * dpr);
  } catch {
    ctx.fillStyle = Avatar.fallbackColor;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    ctx.arc(
      left + (size / 2) * dpr,
      top + (size / 2 + 2) * dpr,
      (size / 2) * dpr,
      0,
      2 * Math.PI
    );
    ctx.fill();
  } finally {
    ctx.restore();
  }
}
