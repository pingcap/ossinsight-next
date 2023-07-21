import { cachedImport } from '@/utils/cache';
import widgets, { datasourceFetchers, metadataGenerators, parameterDefinitions, visualizers } from '@ossinsight/widgets';
import { MetadataGenerator, VisualizerModule, WidgetContext, WidgetMeta } from '@ossinsight/widgets-types';

export function isWidget (name: string) {
  return !!widgets[name];
}

export function widgetMeta (name: string): WidgetMeta {
  return widgets[name];
}

export function widgetNames (): string[] {
  return Object.keys(widgets);
}

export function widgetMetadataGenerator<P> (name: string): Promise<MetadataGenerator<P>> {
  return cachedImport(metadataGenerators[name]);
}

export function widgetDatasourceFetcher (name: string): (context: WidgetContext) => Promise<any> {
  return datasourceFetchers[name];
}

export function widgetVisualizer<Type extends string, VisualizationResult, Data, Params, VisualizerInstance = any> (name: string): Promise<VisualizerModule<any, any, any, any>> {
  return cachedImport(visualizers[name]);
}

export function widgetParameterDefinitions (name: string) {
  return cachedImport(parameterDefinitions[name]);
}
