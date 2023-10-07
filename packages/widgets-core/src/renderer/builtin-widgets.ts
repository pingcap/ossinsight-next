import type { CSSProperties } from 'react';

export interface BuiltinWidgetsMap {
  'builtin:avatar-label': { label?: string; imgSrc: string; size?: number, href?: string };
  'builtin:card-heading': { title: string; subtitle?: string };
  'builtin:label-value': {
    label: string | number;
    value?: string | number;
    labelProps?: {
      style?: CSSProperties;
      className?: string;
    };
    valueProps?: {
      style?: CSSProperties;
      className?: string;
    };
    column?: boolean;
    tooltip?: string;
  };
  'builtin:label': { label: string | number };
  'builtin:empty': {};
  'builtin:avatar-progress': {
    label?: string;
    imgSrc?: string;
    size?: number;
    value: number;
    maxVal: number;
    backgroundColor?: string;
    color?: string;
    valueFormatter?: (value: any) => string;
  };
}

export type BuiltinWidgetProps<K extends keyof BuiltinWidgetsMap> = BuiltinWidgetsMap[K];
