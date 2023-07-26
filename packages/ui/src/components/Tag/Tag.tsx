import clsx from 'clsx';
import { CSSProperties, HTMLAttributes } from 'react';
import * as tailwindColors from 'tailwindcss/colors';
import { getVariantClasses } from '../../utils/variants';

type defaultColors = typeof colors[number]

declare module 'react' {
  interface CSSProperties {
    '--tag-color'?: string;
    '--tag-border-color'?: string;
    '--tag-background-color'?: string;
  }
}

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | defaultColors;
  selected?: boolean;
  onSelected?: () => void;
}

export function Tag ({ variant = 'gray', selected, style, className, onSelected, ...props }: TagProps) {
  const styles = resolveStyles(variant);

  return (
    <span
      style={{
        ...style,
        ...styles,
      }}
      tabIndex={onSelected && 0}
      className={clsx(
        'Tag',
        getVariantClasses('Tag', ['variant', selected && 'selected', onSelected && 'interactive']),
        className,
      )}
      data-selected={selected}
      {...props}
      onClick={onSelected}
    />
  );
}

function resolveStyles (color: 'primary' | defaultColors): CSSProperties {
  if (color === 'primary') {
    return {
      '--tag-color': 'var(--color-primary)',
      '--tag-border-color': 'var(--color-primary-darkened)',
    };
  } else {
    return {
      '--tag-color': tailwindColors[color]['300'],
      '--tag-border-color': tailwindColors[color]['500'],
      '--tag-background-color': tailwindColors[color]['900'],
    };
  }
}

export const colors = [
  'gray',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const;