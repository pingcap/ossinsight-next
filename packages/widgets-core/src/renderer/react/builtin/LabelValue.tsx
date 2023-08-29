import clsx from 'clsx';
import { BuiltinProps, useTheme } from './common';

export function LabelValue({
  className,
  style,
  label,
  value,
  colorScheme,
  labelProps = {},
  valueProps = {},
  column = true,
}: BuiltinProps<'builtin:label-value'>) {
  const { Label, Value } = useTheme(colorScheme);

  return (
    <div
      className={clsx(className, 'flex items-start gap-1', {
        'flex-col': column,
      })}
      style={{ zIndex: 1, ...style }}
    >
      <span
        style={{
          fontSize: 12,
          lineHeight: 1,
          color: Label.color,
          overflow: 'visible',
          whiteSpace: 'nowrap',
          ...labelProps.style,
        }}
        className={labelProps.className}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 24,
          lineHeight: 1,
          fontWeight: 'bold',
          color: Value.color,
          overflow: 'visible',
          whiteSpace: 'nowrap',
          ...valueProps.style,
        }}
        className={valueProps.className}
      >
        {value}
      </span>
    </div>
  );
}
