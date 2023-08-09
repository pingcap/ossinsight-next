import clsx from 'clsx';
import { CSSProperties, ReactNode, useId } from 'react';

type BuiltinProps<P extends Record<string, any>> = {
  style?: CSSProperties
  className?: string
} & P

export function CardHeading ({ className, style, title, subtitle }: BuiltinProps<{ title: ReactNode, subtitle: ReactNode }>) {
  const id = useId();
  return (
    <div id={id} className={clsx(className, 'flex items-center justify-between')} style={style}>
      <span style={{ fontSize: 14, lineHeight: 1, fontWeight: 'bold', color: 'rgba(193, 193, 193, 1)' }}>
        {title}
      </span>
      <span style={{ fontSize: 12, lineHeight: 1, fontStyle: 'italic', color: 'rgba(124, 124, 124, 1)' }}>
        {subtitle}
      </span>
    </div>
  );
}

export function LabelValue ({ className, style, label, value }: BuiltinProps<{ label: ReactNode, value: ReactNode }>) {
  return (
    <div className={clsx(className, 'flex flex-col items-start gap-1')} style={style}>
      <span style={{ fontSize: 12, lineHeight: 1, color: 'white' }}>{label}</span>
      <span style={{ fontSize: 24, lineHeight: 1, fontWeight: 'bold', color: 'white' }}>{value}</span>
    </div>
  );
}

export function Label ({ className, style, label }: BuiltinProps<{ label: ReactNode }>) {
  return (
    <div className={clsx(className, 'flex items-center justify-center')} style={style}>
      <span style={{ fontSize: 12, lineHeight: 1, color: '#C1C1C1' }}>{label}</span>
    </div>
  );
}

export function AvatarLabel({
  className,
  style,
  label,
  imgSrc,
}: BuiltinProps<{ label: string; imgSrc: string; }>) {
  return (
    <div
      className={clsx(className, 'flex flex-row items-center gap-1')}
      style={style}
    >
      <div className='bg-blackA3 inline-flex h-[24px] w-[24px] select-none items-center justify-center overflow-hidden rounded-full align-middle'>
        <img
          className='h-full w-full rounded-[inherit] object-cover'
          src={imgSrc}
          alt={label}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          lineHeight: 1,
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        {label}
      </span>
    </div>
  );
}
