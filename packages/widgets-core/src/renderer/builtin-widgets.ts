import type { CSSProperties } from 'react';

export interface BuiltinWidgetsMap {
  'builtin:avatar-label': { label?: string; imgSrc: string; size?: number };
  'builtin:card-heading': { title: string; subtitle?: string };
  'builtin:label-value': {
    label: string;
    value?: string;
    labelProps?: {
      style?: CSSProperties;
      className?: string;
    };
    valueProps?: {
      style?: CSSProperties;
      className?: string;
    };
    column?: boolean;
  };
  'builtin:label': { label: string };
  'builtin:empty': {};
}

export type BuiltinWidgetProps<K extends keyof BuiltinWidgetsMap> = BuiltinWidgetsMap[K];
