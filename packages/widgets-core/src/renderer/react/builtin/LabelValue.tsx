import clsx from 'clsx';
import { BuiltinProps, useTheme } from './common';

export function LabelValue ({ className, style, label, value, colorScheme }: BuiltinProps<'builtin:label-value'>) {
  const { Label, Value } = useTheme(colorScheme);

  return (
    <div className={clsx(className, 'flex flex-col items-start gap-1')} style={{ zIndex: 1, ...style }}>
      <span style={{ fontSize: 12, lineHeight: 1, color: Label.color, overflow: 'visible', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 24, lineHeight: 1, fontWeight: 'bold', color: Value.color, overflow: 'visible', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}
