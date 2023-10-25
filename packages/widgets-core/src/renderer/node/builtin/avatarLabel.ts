import { Canvas, loadImage, Path2D } from '@napi-rs/canvas';
import { getTheme } from '../../../utils/theme';
import { withTimeout } from '../../../utils/timeout';
import { BuiltinProps } from './commons';
import { formatNumber } from '@ossinsight/widgets-utils/src/utils';

export async function renderAvatarLabel (
  canvas: Canvas,
  props: BuiltinProps<'builtin:avatar-label'>,
) {
  const {
    label = '',
    box: { dpr, left, top, width },
    imgSrc,
    imgSize = 20,
  } = props;

  const { Label, Avatar } = getTheme(props.colorScheme);

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = 'none';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';

  ctx.font = `normal ${12 * dpr}px`;
  ctx.fillStyle = Label.color;
  const labelStr = typeof label === 'number' ? formatNumber(label) : label;
  label && ctx.fillText(labelStr, left + 30 * dpr, top + 7 * dpr, width);

  try {
    const buffer = await withTimeout(async (signal) => {
      return await fetch(imgSrc, { cache: 'force-cache', signal }).then((res) => {
        if (res.ok) {
          return res.arrayBuffer();
        } else {
          throw new Error(`${res.status} ${res.statusText} ${imgSrc}`);
        }
      });
    }, 2000);
    const avatar = await loadImage(buffer, {
      alt: 'label',
      requestOptions: {
        timeout: 1000,
      },
    });
    let circlePath = new Path2D();
    circlePath.arc(
      left + (imgSize / 2) * dpr,
      top + (imgSize / 2 + 2) * dpr,
      (imgSize / 2) * dpr,
      0,
      2 * Math.PI,
    );
    ctx.clip(circlePath);
    ctx.drawImage(avatar, left, top + 2 * dpr, imgSize * dpr, imgSize * dpr);
  } catch {
    ctx.fillStyle = Avatar.fallbackColor;
    ctx.lineWidth = dpr;
    ctx.beginPath();
    ctx.arc(
      left + (imgSize / 2) * dpr,
      top + (imgSize / 2 + 2) * dpr,
      (imgSize / 2) * dpr,
      0,
      2 * Math.PI,
    );
    imgSrc && ctx.fill();
  } finally {
    ctx.restore();
  }
}