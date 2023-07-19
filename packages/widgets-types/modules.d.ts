declare module '@ossinsight/widgets' {
  const widgets: Record<string, () => Promise<import('./index').WidgetModule<any, any, any, any>>>;
  const datasourceFetchers: Record<string, (context: import('./index').WidgetContext) => Promise<any>>;

  const parameterDefinitions: Record<string, () => Promise<import('./index').ParameterDefinitions>>;

  export default widgets;

  export { datasourceFetchers, parameterDefinitions };
}
