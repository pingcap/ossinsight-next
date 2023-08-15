import { cachedImport } from '@/utils/cache';
import { WidgetsFilterConfig } from '@ossinsight/ui/src/components/WidgetsFilter';
import widgets, { datasourceFetchers, metadataGenerators, parameterDefinitions, visualizers } from '@ossinsight/widgets';
import { MetadataGenerator, VisualizerModule, WidgetBaseContext, WidgetMeta } from '@ossinsight/widgets-types';

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

export function widgetDatasourceFetcher (name: string): (context: WidgetBaseContext) => Promise<any> {
  return datasourceFetchers[name];
}

export function widgetVisualizer<Type extends string, VisualizationResult, Data, Params, VisualizerInstance = any> (name: string): Promise<VisualizerModule<any, any, any, any>> {
  return cachedImport(visualizers[name]);
}

export function widgetParameterDefinitions (name: string) {
  return cachedImport(parameterDefinitions[name]);
}

export function filteredWidgetsNames ({ search, tag = '🔥Popular' }: WidgetsFilterConfig) {
  return Object.entries(widgets)
    .filter(([name, meta]) => {
      if (meta.private) {
        return false;
      }
      const texts = [
        name.toLowerCase(),
        meta.name.toLowerCase(),
        meta.description?.toLowerCase(),
        ...(meta.keywords ?? []).flatMap(keyword => keyword.toLowerCase()),
      ].filter(v => v != null) as string[];

      let found = true;

      if (search) {
        found = texts.some(text => text.includes(search.toLowerCase()));
      } else {
        found &&= true;
      }

      if (tag && tag !== 'All') {
        found = !!meta.keywords?.includes(tag)
      } else {
        found &&= true;
      }

      return found;
    })
    .map(([name]) => name);
}
