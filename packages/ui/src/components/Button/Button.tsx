import clsx from 'clsx';
import { ButtonHTMLAttributes, Ref } from 'react';
import { getVariantClasses } from '../../utils/variants';

export type ButtonVariant = 'primary'
export type ButtonSize = 'lg' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant,
  size,
  className,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      {...props}
      className={
        clsx(
          'Button',
          className,
          getVariantClasses('Button', [variant, size]),
        )
      }
    />
  );
}
