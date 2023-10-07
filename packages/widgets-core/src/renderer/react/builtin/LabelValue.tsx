import clsx from 'clsx';
import { formatNumber } from '@ossinsight/widgets-utils/src/utils';
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
  tooltip = '',
}: BuiltinProps<'builtin:label-value'>) {
  const { Label, Value } = useTheme(colorScheme);

  return (
    <div
      className={clsx(className, 'group flex items-start gap-1', {
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
          position: 'relative',
          ...labelProps.style,
        }}
        className={labelProps.className}
      >
        {typeof label === 'number' ? formatNumber(label) : label || ''}
        {tooltip && (
          <span
            className={clsx(
              'invisible group-hover:visible w-auto h-auto px-4 py-2 bg-[var(--background-color-popover)] text-[var(--text-color-content)] rounded absolute text-sm top-[150%] left-0',
              `after:content-[' '] after:absolute after:top-0 after:top-[-10px] after:left-1/2 after:border-transparent after:border-b-[var(--background-color-popover)] after:border-solid after:border-[5px]`
            )}
          >
            {tooltip}
          </span>
        )}
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
        {typeof value === 'number' ? formatNumber(value) : value || ''}
      </span>
    </div>
  );
}
