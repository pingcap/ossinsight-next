import clsx from 'clsx';
import { BuiltinProps, useTheme } from './common';

export function AvatarLabel({
  className,
  style,
  label = '',
  imgSrc = '',
  imgSize = 20,
  colorScheme,
  href = '',
}: BuiltinProps<'builtin:avatar-label'>) {
  const { Label } = useTheme(colorScheme);

  return (
    <div
      className={clsx(className, 'flex flex-row items-center', {
        ['gap-1']: !!label,
      })}
      style={style}
    >
      <Wrapper href={href}>
        <div
          className={clsx(
            `bg-blackA3 inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle`,
          )}
          style={{
            height: `${imgSize}px`,
            width: `${imgSize}px`,
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
      </Wrapper>
    </div>
  );
}

const Wrapper = (props: { children: React.ReactNode; href: string }) => {
  const { children, href } = props;

  if (href) {
    return (
      <a href={href} target='_blank'>
        {children}
      </a>
    );
  }

  return <>{children}</>;
};
