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
    labelProps,
    valueProps,
    column = true,
  } = props;

  const { Label, Value } = getTheme(props.colorScheme);

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = 'none';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'start';

  ctx.font = `${labelProps?.style?.fontWeight || 'normal'} ${(Number(labelProps?.style?.fontSize) || 12) * dpr}px`;
  ctx.fillStyle = labelProps?.style?.color || Label.color;
  ctx.fillText(label, left, top, width);

  const measured = ctx.measureText(label);
  const fontHeight =
    measured.fontBoundingBoxAscent + measured.fontBoundingBoxDescent;

  ctx.font = `${valueProps?.style?.fontWeight || 'bold'} ${(Number(valueProps?.style?.fontSize) || 24) * dpr}px`;
  ctx.fillStyle = valueProps?.style?.color || Value.color;
  const valMarginLeftAuto = valueProps?.style?.marginLeft === 'auto';
  valMarginLeftAuto && (ctx.textAlign = 'right');
  column && value && ctx.fillText(String(value), left, top + fontHeight + 4 * dpr, width);
  !column && value && ctx.fillText(String(value), valMarginLeftAuto ? width : width / 2, top, width);

  ctx.restore();
}
