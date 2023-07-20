declare module '@ossinsight/widgets' {
  import { VisualizerModule } from './index';
  const widgets: Record<string, import('./index').WidgetMeta>;

  const visualizers: Record<string, () => Promise<VisualizerModule<any, any, any, any>>>;

  const datasourceFetchers: Record<string, (context: import('./index').WidgetContext) => Promise<any>>;

  const parameterDefinitions: Record<string, () => Promise<import('./index').ParameterDefinitions>>;

  export default widgets;

  export { visualizers, datasourceFetchers, parameterDefinitions };
}
