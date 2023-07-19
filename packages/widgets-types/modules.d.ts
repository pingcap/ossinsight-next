declare module '@ossinsight/widgets' {
  const widgets: Record<string, () => Promise<import('./index').WidgetModule<any, any, any, any>>>;
  const datasourceFetchers: Record<string, (context: import('./index').WidgetContext) => Promise<any>>;

  export default widgets;

  export { datasourceFetchers };
}
