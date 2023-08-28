import clsx from 'clsx';
import { BuiltinProps, useTheme } from './common';

export function AvatarLabel ({
  className,
  style,
  label = '',
  imgSrc = '',
  size = 20,
  colorScheme,
}: BuiltinProps<'builtin:avatar-label'>) {
  const { Label } = useTheme(colorScheme);

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