import clsx from 'clsx';
import { CSSProperties, ReactNode } from 'react';

type BuiltinProps<P extends Record<string, any>> = {
  style?: CSSProperties
  className?: string
} & P

export function CardHeading ({ className, style, title, subtitle }: BuiltinProps<{ title: ReactNode, subtitle: ReactNode }>) {
  return (
    <div className={clsx(className, 'flex items-center justify-between')} style={style}>
      <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 'bold', color: 'rgba(193, 193, 193, 1)' }}>
        {title}
      </span>
      <span style={{ fontSize: 12, lineHeight: 1, fontStyle: 'italic', color: 'rgba(124, 124, 124, 1)' }}>
        {subtitle}
      </span>
    </div>
  );
}

export function LabelValue ({ className, style, label, value }: BuiltinProps<{ label: string, value: string }>) {
  return (
    <div className={clsx(className, 'flex flex-col items-start gap-1')} style={style}>
      <span style={{ fontSize: 12, lineHeight: 1, color: 'white' }}>{label}</span>
      <span style={{ fontSize: 24, lineHeight: 1, fontWeight: 'bold', color: 'white' }}>{value}</span>
    </div>
  );
}
