import type { EChartsOption } from 'echarts';
import type * as colors from 'tailwindcss/colors';

export interface WidgetContext<P extends Record<string, any> = Record<string, any>> {
  runtime: 'server' | 'client';
  parameters: P;
}

export interface WidgetVisualizerContext<P extends Record<string, any> = Record<string, any>> extends WidgetContext<P> {
  theme: {
    colors: typeof colors
  };
}

export type EChartsVisualizationConfig = EChartsOption;

export type VisualizeFunction<R, D, P> = (data: D, ctx: WidgetVisualizerContext<P>) => R

export interface WidgetModule<T extends string, R, D, P> {
  type: T;
  default: VisualizeFunction<R, D, P>;

  name: string;
  description: string;
  version: string;
}

