import { Canvas } from '@napi-rs/canvas';
import { getTheme } from '../../../utils/theme';
import { BuiltinProps } from './commons';

export function renderLabelValue (
  canvas: Canvas,
  props: BuiltinProps<'builtin:label-value'>,
) {
  const {
    label,
    box: { dpr, left, top, width },
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
