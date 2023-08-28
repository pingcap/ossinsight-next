import clsx from 'clsx';
import { BuiltinProps, useTheme } from './common';

export function Label ({ className, style, label, colorScheme }: BuiltinProps<'builtin:label-value'>) {
  const { Label } = useTheme(colorScheme);

  return (
    <div className={clsx(className, 'flex items-center justify-center')} style={style}>
      <span style={{ fontSize: 12, lineHeight: 1, color: Label.color }}>{label}</span>
    </div>
  );
}