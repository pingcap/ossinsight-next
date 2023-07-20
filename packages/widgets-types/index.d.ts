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

  getRepo (id: number): any;

  getUser (id: number): any;

  getCollection (id: number): any;

  getOrg (id: number): any;
}

export type EChartsVisualizationConfig = EChartsOption;

export type VisualizeFunction<R, D, P> = (data: D, ctx: WidgetVisualizerContext<P>) => R

export interface WidgetMeta {
  name: string;
  description?: string;
  version: string;
  keywords?: string[];
  author?: string | Partial<{ email: string, name: string, url: string }>;
}

export interface VisualizerModule<T extends string, R, D, P> {
  type: T;
  default: VisualizeFunction<R, D, P>;
}

export interface BaseParameterDefinition {
  type: string;
  title?: string;
  description?: string;
  required: boolean;
}

export interface RepoIdParameterDefinition extends BaseParameterDefinition {
  type: 'repo-id';
}

export type ParameterDefinition = RepoIdParameterDefinition; // | Others;

export type ParameterDefinitions = Record<string, ParameterDefinition>;
