import clsx from 'clsx';
import { CSSProperties, ReactNode, useId } from 'react';
import { getTheme } from '../../utils/theme';

type BuiltinProps<P extends Record<string, any>> = {
  style?: CSSProperties
  className?: string
  colorScheme?: string
} & P

const useTheme = (colorScheme: string) => {
  return getTheme(colorScheme);
};

export function CardHeading ({ className, style, title, subtitle, colorScheme }: BuiltinProps<{ title: ReactNode, subtitle: ReactNode }>) {
  const id = useId();
  const { CardHeader } = useTheme(colorScheme)

  return (
    <div id={id} className={clsx(className, 'flex items-center', subtitle ? 'justify-between' : 'justify-center')} style={style}>
      <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 'bold', color: CardHeader.titleColor }}>
        {title}
      </span>
      {subtitle && <span style={{ fontSize: 12, lineHeight: 1, fontStyle: 'italic', color: CardHeader.subtitleColor }}>
        {subtitle}
      </span>}
    </div>
  );
}

export function LabelValue ({ className, style, label, value, colorScheme }: BuiltinProps<{ label: ReactNode, value: ReactNode }>) {
  const { Label, Value } = useTheme(colorScheme)

  return (
    <div className={clsx(className, 'flex flex-col items-start gap-1')} style={style}>
      <span style={{ fontSize: 12, lineHeight: 1, color: Label.color, overflow: 'visible', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 24, lineHeight: 1, fontWeight: 'bold', color: Value.color, overflow: 'visible', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

export function Label ({ className, style, label, colorScheme }: BuiltinProps<{ label: ReactNode }>) {
  const { Label } = useTheme(colorScheme)

  return (
    <div className={clsx(className, 'flex items-center justify-center')} style={style}>
      <span style={{ fontSize: 12, lineHeight: 1, color: Label.color }}>{label}</span>
    </div>
  );
}

export function AvatarLabel ({
  className,
  style,
  label = '',
  imgSrc = '',
  size = 20,
  colorScheme,
}: BuiltinProps<{ label?: string; imgSrc?: string; size?: number }>) {
  const { Label } = useTheme(colorScheme)

  return (
    <div
      className={clsx(className, 'flex flex-row items-center', {
        ['gap-1']: !!label,
      })}
      style={style}
    >
      <div
        className={clsx(
          `bg-blackA3 inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle`,
          `h-[${size}px] w-[${size}px]`,
        )}
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        {imgSrc && (
          <img
            className="h-full w-full rounded-[inherit] object-cover"
            src={imgSrc}
            alt={label}
          />
        )}
      </div>
      <span
        style={{
          fontSize: 12,
          lineHeight: 1,
          fontWeight: 'bold',
          color: Label.color,
        }}
      >
        {label}
      </span>
    </div>
  );
}
