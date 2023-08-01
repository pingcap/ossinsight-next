import type { EChartsOption } from 'echarts';
import type * as colors from 'tailwindcss/colors';

export interface BasicContext {
  theme: {
    colors: typeof colors
  };
  getTimeParams (): { zone: string, period: string };
}

export interface WidgetBaseContext<P extends Record<string, any> = Record<string, any>> {
  runtime: 'server' | 'client';
  parameters: P;
}

export interface LinkedDataContext {
  getRepo (id: number): { id: number, fullName: string } | undefined;

  getUser (id: number): any;

  getCollection (id: number): any;

  getOrg(id: number): any;
}

export interface WidgetVisualizerContext<P extends Record<string, any> = Record<string, any>> extends WidgetBaseContext<P>, BasicContext, LinkedDataContext {
  /**
   * The container width when executing the visualization function.
   */
  width: number;

  /**
   * The container height when executing the visualization function.
   */
  height: number;
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

export interface VisualizerModule<Type extends string, VisualizationResult, Data, Params, VisualizerInstance = any> {
  type: Type;
  default: VisualizeFunction<VisualizationResult, Data, Params>;

  /**
   *
   * @param instance instance of visualizer provider. like 'EChartsInstance'
   * @param result last result generated by visualization function
   * @param width new container width
   * @param height new container height
   */
  onSizeChange?: (instance: VisualizerInstance, result: VisualizationResult, width: number, height: number) => void;

  /**
   *
   * @param instance instance of visualizer provider. like 'EChartsInstance'
   * @param result last result generated by visualization function
   * @param colorScheme new color scheme
   */
  onColorSchemeChange?: (instance: VisualizerInstance, result: VisualizationResult, colorScheme: 'light' | 'dark') => void;

  computeDynamicHeight?: (data: Data) => number
}

export interface BaseParameterDefinition {
  type: string;
  title?: string;
  description?: string;
  required: boolean;
  default?: unknown;
}

export interface RepoIdParameterDefinition extends BaseParameterDefinition {
  type: 'repo-id';
}

export interface UserIdParameterDefinition extends BaseParameterDefinition {
  type: 'user-id';
}

export interface CollectionIdParameterDefinition extends BaseParameterDefinition {
  type: 'collection-id';
}

export interface TimePeriodParameterDefinition extends BaseParameterDefinition {
  type: 'time-period';
}

export interface TimeZoneParameterDefinition extends BaseParameterDefinition {
  type: 'time-zone';
}


export interface ActivityTypeParameterDefinition extends BaseParameterDefinition {
  type: 'activity-type';
  enums?: string[];
}

export type ParameterDefinition =
  | RepoIdParameterDefinition
  | UserIdParameterDefinition
  | CollectionIdParameterDefinition
  | TimeZoneParameterDefinition
  | TimePeriodParameterDefinition
  | ActivityTypeParameterDefinition; // | Others;

export type ParameterDefinitions = Record<string, ParameterDefinition>;

export type MetadataGenerator<P> = (ctx: WidgetVisualizerContext<P>) => Partial<{ title: string, description: string, keywords: [] }>
