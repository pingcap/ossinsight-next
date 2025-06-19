import { isWidget, widgetParameterDefinitions } from '@/utils/widgets';
import { LinkedData, resolveParameters } from '@ossinsight/widgets-core/src/parameters/resolver';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export type WidgetPageProps = { params: Promise<{ vendor: string, name: string }>, searchParams: Promise<Record<string, string | string[]>> };

export const widgetPageParams = cache(async (paramsPromise: WidgetPageProps['params']) => {
  const params = await paramsPromise;
  if (params.vendor !== 'official') {
    notFound();
  }

  const name = `@ossinsight/widget-${decodeURIComponent(params.name)}`;
  if (!isWidget(name)) {
    notFound();
  }

  return {
    vendor: decodeURIComponent(params.vendor),
    name,
  };
});

export async function widgetSignature (props: WidgetPageProps) {
  return JSON.stringify({ params: await props.params, searchParams: await props.searchParams });
}

export const makeLinkedData = cache(async (name: string, searchParamsPromise: Promise<Record<string, string | string[]>>, defaultLinkedData?: LinkedData, signal?: AbortSignal) => {
  const searchParams = await searchParamsPromise;
  return widgetParameterDefinitions(name).then(paramDef => resolveParameters(paramDef, searchParams, defaultLinkedData, signal));
});

export function stringArrayRecord2UrlSearch (values: Record<string, string | string[]>) {
  const newValues = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) {
    if (Array.isArray(v)) {
      v.forEach((i) => newValues.append(k, i));
    } else {
      newValues.set(k, v);
    }
  }
  return newValues;
}

const allowVsWidgets: string[] = [
  'analyze-repo-stars-history',
].map(name => `@ossinsight/widget-${name}`);
const disallowParams = [
  'image_size',
  'color_scheme',
];

export function filterWidgetUrlParameters (name: string, paramName: string) {
  if (paramName === 'vs_repo_id') {
    return allowVsWidgets.includes(name);
  }
  return !disallowParams.includes(paramName);
}

export function getExcludeWidgetParameters (name: string) {
  if (allowVsWidgets.includes(name)) {
    return [];
  }
  return ['vs_repo_id'];
}
