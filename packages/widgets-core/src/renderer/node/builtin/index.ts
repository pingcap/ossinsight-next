import { Canvas } from '@napi-rs/canvas';
import { BuiltinWidgetsMap } from '../../builtin-widgets';
import { renderAvatarLabel } from './avatarLabel';
import { renderCardHeading } from './cardHeading';
import { renderEmpty } from './empty';
import { renderLabelValue } from './labelValue';
import { BuiltinProps, transformBox } from './commons';

export async function renderBuiltin (canvas: Canvas, name: string, props: BuiltinProps<any>): Promise<void>
export async function renderBuiltin<K extends keyof BuiltinWidgetsMap> (canvas: Canvas, name: K, props: BuiltinProps<K>): Promise<void>
export async function renderBuiltin (canvas: Canvas, name: string, props: BuiltinProps<any>): Promise<void> {
  props = { ...props, box: transformBox(props.box) }

  switch (name) {
    case 'builtin:label':
    case 'builtin:avatar-label':
      await renderAvatarLabel(canvas, props as BuiltinProps<'builtin:avatar-label'>);
      break;
    case 'builtin:card-heading':
      renderCardHeading(canvas, props as BuiltinProps<'builtin:card-heading'>);
      break;
    case 'builtin:label-value':
      renderLabelValue(canvas, props as BuiltinProps<'builtin:label-value'>);
      break;
    case 'builtin:empty':
      await renderEmpty(canvas, props as BuiltinProps<'builtin:empty'>);
      break;
    default:
      break;
  }
}