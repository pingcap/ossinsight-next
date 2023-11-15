type MockCSSProperties = {
  color?: string
  fontSize?: number | string
  fontWeight?: number | string
  marginLeft?: string | number
}

export interface BuiltinWidgetsMap {
  'builtin:avatar-label': { label?: string; imgSrc: string; imgSize?: number, href?: string };
  'builtin:card-heading': { title: string; subtitle?: string };
  'builtin:label-value': {
    label: string | number;
    value?: string | number;
    labelProps?: {
      style?: MockCSSProperties;
      className?: string;
    };
    valueProps?: {
      style?: MockCSSProperties;
      className?: string;
      tooltip?: string;
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
    labelColor?: string[];
    href?: string;
  };
}

export type BuiltinWidgetProps<K extends keyof BuiltinWidgetsMap> = BuiltinWidgetsMap[K];
