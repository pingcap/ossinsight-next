import { WidgetBaseContext } from '@ossinsight/widgets-types';
import jp from 'jsonpath/jsonpath.js';
import { parseTemplate } from 'url-template';
import { ParserConfig } from '../types';
import { HttpRequestError } from '../utils/errors';

export interface ApiDatasourceConfig {
  type: 'api';
  url: string;
  parser: ParserConfig;
  params?: Record<string, string>;
  when?: string[];
}

export default async function executeApiDatasource (config: ApiDatasourceConfig, ctx: WidgetBaseContext, signal?: AbortSignal) {
  if (!allExists(config.when, ctx.parameters)) {
    return null;
  }

  const template = parseTemplate(config.url);
  // TODO: replaceAll is a workaround, e.g. /api/queries/orgs/issues%2Fclosed-ratio => /api/queries/orgs/issues/closed-ratio
  const urlExpanded = template.expand(ctx.parameters).replaceAll(`%2F`, `/`);
  let url: string | URL = '';
  if (ctx.runtime === 'server') {
    url = new URL(urlExpanded, getBaseUrl());
    setUrlParams(url.searchParams, config.params ?? {}, ctx.parameters);
  } else {
    const urlSearchParams = new URLSearchParams();
    setUrlParams(urlSearchParams, config.params ?? {}, ctx.parameters);
    url = `${url}?${urlSearchParams.toString()}`;
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new HttpRequestError(response, await response.json());
  }

  const data = await response.json();

  return jp.query(data, config.parser.extract);
}

function allExists (required: string[] | undefined, params: Record<string, string>): boolean {
  if (!required) {
    return true;
  }

  for (let key of required) {
    if (!(key in params)) {
      return false;
    }
  }

  return true;
}

function setUrlParams(urlSearchParams: URLSearchParams, urlParams: Record<string, string>, parameters: Record<string, string | string[]>) {
  for (let [name, paramName] of Object.entries(urlParams)) {
    if (paramName in parameters) {
      const value = parameters[paramName];
      if (Array.isArray(value)) {
        value.forEach((value) => {
          urlSearchParams.append(name, value);
        });
        continue;
      }
      value && urlSearchParams.set(name, value);
    }
  }
}

function getBaseUrl() {
  const env =
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.VERCEL_ENV ||
    process.env.NODE_ENV;
  switch (env) {
    case 'production':
      // TODO: change to https://ossinsight.io when we have promoted to production
      return `https://next.ossinsight.io`;
    case 'preview':
      const previewHost =
        process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL || process.env.VERCEL_BRANCH_URL;
      return `https://${previewHost}`;
    case 'development':
    default:
      const devHost =
        process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL || process.env.VERCEL_BRANCH_URL;
      return devHost
        ? `https://${devHost}`
        : `http://localhost:${process.env.PORT || 3000}`;
  }
}
