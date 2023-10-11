import { makeLinkedData } from '@/app/widgets/[vendor]/[name]/utils';
import { cachedImport } from '@/utils/cache';
import { WidgetsFilterConfig } from '@ossinsight/ui/src/components/WidgetsFilter';
import widgets, { datasourceFetchers, metadataGenerators, parameterDefinitions, visualizers } from '@ossinsight/widgets';
import { resolveExpressions } from '@ossinsight/widgets-core/src/parameters/resolveExpressions';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createWidgetBaseContext } from '@ossinsight/widgets-core/src/utils/context';
import { isEmptyData } from '@ossinsight/widgets-core/src/utils/datasource';
import { ComposeVisualizationConfig, MetadataGenerator, VisualizerModule, WidgetBaseContext, WidgetMeta, WidgetVisualizerContext } from '@ossinsight/widgets-types';
import { computeLayout, vertical, widget } from '@ossinsight/widgets-utils/src/compose';

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

export function widgetDatasourceFetcher (name: string): (context: WidgetBaseContext, signal?: AbortSignal) => Promise<any> {
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
        found = !!meta.keywords?.includes(tag);
      } else {
        found &&= true;
      }

      return found;
    })
    .map(([name]) => name);
}

export function nonPopularWidgetsNames () {
  return Object.entries(widgets)
    .filter(([, meta]) => {
      if (meta.private) {
        return false;
      }
      return !meta.keywords?.includes('🔥Popular');
    })
    .map(([name]) => name);
}

type DefaultComposeLayoutOptions = {
  generateMetadata: MetadataGenerator<any>
  ctx: WidgetVisualizerContext
  isDynamicHeight?: boolean
}

export function createDefaultComposeLayout (name: string, data: any, { generateMetadata, ctx, isDynamicHeight }: DefaultComposeLayoutOptions): VisualizerModule<'compose', ComposeVisualizationConfig, any, any> {
  const title = generateMetadata(ctx).title;

  const HEADER_HEIGHT = 48;
  const PADDING = 24;

  return {
    default (_, _ctx) {
      return computeLayout(
        vertical(
          widget('builtin:card-heading', undefined, {
            title: title,
          })
            .padding([0, PADDING])
            .fix(HEADER_HEIGHT),
          isEmptyData(data)
            ? widget('builtin:empty', undefined, {})
            : widget(name, data, ctx.parameters).padding([0, PADDING, PADDING]),
        ),
        0, 0, _ctx.width, _ctx.height,
      );
    },
    type: 'compose',
    width: 0,
    height: 0,
  };
}

export type WidgetData = Awaited<ReturnType<typeof fetchWidgetData>>;

export async function fetchWidgetData (name: string, searchParams: Record<string, string | string[]>, propLinkedData?: LinkedData, signal?: AbortSignal) {
  const fetcher = widgetDatasourceFetcher(name);

  const [params, linkedData] = await Promise.all([
    widgetParameterDefinitions(name),
    makeLinkedData(name, searchParams, propLinkedData, signal),
  ]);

  const parameters = {
    ...searchParams,
    ...resolveExpressions(params),
  };

  const data = await fetcher(createWidgetBaseContext('server', {
    ...searchParams,
    ...resolveExpressions(params),
  }), signal);

  return {
    parameters,
    data,
    linkedData,
  };
}
