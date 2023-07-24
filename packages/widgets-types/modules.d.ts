declare module '@ossinsight/widgets' {
  const widgets: Record<string, import('./index').WidgetMeta>;

  const visualizers: Record<string, () => Promise<import('./index').VisualizerModule<any, any, any, any>>>;

  const datasourceFetchers: Record<string, (context: import('./index').WidgetContext) => Promise<any>>;

  const parameterDefinitions: Record<string, () => Promise<import('./index').ParameterDefinitions>>;

  const metadataGenerators: Record<string, () => Promise<import('./index').MetadataGenerator<any>>>;

  export default widgets;

  export { visualizers, datasourceFetchers, parameterDefinitions, metadataGenerators };
}
