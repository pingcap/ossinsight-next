/// <reference types="csstype" />

import { createElement, CSSProperties, ReactHTML, ReactNode } from 'react';

interface BasicProps {
  as?: keyof ReactHTML;
  className?: string;
  style?: CSSProperties;
}

export interface FlexProps extends BasicProps {
  items?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  gap?: CSSProperties['gap'];
  children: ReactNode;
}

export interface SpanProps extends BasicProps {
  children: string | number | null | undefined | boolean | (string | number | null | undefined | boolean)[];
}

export function Flex ({ as = 'div', className, style, items, justify, gap, children }: FlexProps) {
  className = className ? `${className} flex` : 'flex';
  if (items) {
    className += ` items-${items}`;
  }
  if (justify) {
    className += ` justify-${justify}`;
  }

  if (gap) {
    style = {
      ...style,
      gap: typeof gap === 'number' ? gap * 4 : gap,
    }
  }

  return createElement(as, {
    className,
    tw: className,
    style,
    children,
  });
}

export function Span ({ as = 'span', className, style, children }: SpanProps) {
  return createElement(as, {
    className,
    tw: className,
    style,
    children,
  });
}
