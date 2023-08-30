import clsx from 'clsx';
import { BuiltinProps, useTheme } from './common';

export function AvatarProgress({
  className,
  style,
  label = '',
  imgSrc = '',
  value = 0,
  maxVal = 100,
  size = 20,
  colorScheme,
}: BuiltinProps<'builtin:avatar-progress'>) {
  const { Label } = useTheme(colorScheme);

  return (
    <div
      className={clsx(className, 'flex flex-row items-center', {
        ['gap-2']: !!label,
      })}
      style={style}
    >
      <div
        className={clsx(
          `bg-blackA3 inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle`,
          `h-[${size}px] w-[${size}px]`
        )}
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        {imgSrc && (
          <img
            className='h-full w-full rounded-[inherit] object-cover'
            src={imgSrc}
            alt={label}
          />
        )}
      </div>
      <div
        className={clsx('grow flex flex-col justify-between', `h-[${size}px]`)}
      >
        <div className='flex justify-between'>
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
          <span
            style={{
              fontSize: 12,
              lineHeight: 1,
              fontWeight: 'bold',
              color: Label.color,
            }}
          >
            {value}
          </span>
        </div>
        <div className='h-1 w-full bg-[var(--scrollbar-track-color)]'>
          <div
            className='h-1 bg-primary'
            style={{
              width: `${(value / maxVal) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
