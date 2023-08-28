export interface BuiltinWidgetsMap {
  'builtin:avatar-label': { label?: string; imgSrc: string; size?: number };
  'builtin:card-heading': { title: string; subtitle?: string };
  'builtin:label-value': { label: string; value?: string };
  'builtin:label': { label: string; };
  'builtin:empty': {};
}

export type BuiltinWidgetProps<K extends keyof BuiltinWidgetsMap> = BuiltinWidgetsMap[K];
