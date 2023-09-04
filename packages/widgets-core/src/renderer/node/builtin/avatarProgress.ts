import { Canvas, loadImage, Path2D } from '@napi-rs/canvas';
import { getTheme } from '../../../utils/theme';
import { BuiltinProps } from './commons';

export async function renderAvatarProgress(
  canvas: Canvas,
  props: BuiltinProps<'builtin:avatar-progress'>
) {
  const {
    box: { dpr, left, top, width },
    label = '',
    imgSrc = '',
    value = 0,
    maxVal = 100,
    size = 20,
  } = props;

  const { Label, Value, Avatar } = getTheme(props.colorScheme);

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = 'none';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';

  ctx.font = `normal ${12 * dpr}px`;
  ctx.fillStyle = Label.color;
  label && ctx.fillText(label, left + 30 * dpr, top + 7 * dpr, width);
  ctx.textAlign = 'right';
  label && ctx.fillText(String(value), width, top + 7 * dpr, width);

  ctx.fillStyle = '#888';
  ctx.fillRect(left + 30 * dpr, top + 20 * dpr, width - left, 4 * dpr);

  ctx.fillStyle = '#ffe895';
  const percent = value / maxVal;
  ctx.fillRect(
    left + 30 * dpr,
    top + 20 * dpr,
    (width - left) * percent,
    4 * dpr
  );

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
