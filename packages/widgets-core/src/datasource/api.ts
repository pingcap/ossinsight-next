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
  const urlexpanded = template.expand(ctx.parameters).replaceAll(`%2F`, `/`);
  console.log(`[debug] getBaseUrl === ${getBaseUrl()}`);
  console.log(`[debug] NEXT_PUBLIC_VERCEL_ENV === ${process?.env?.NEXT_PUBLIC_VERCEL_ENV}`);
  console.log(`[debug] VERCEL_ENV === ${process?.env?.VERCEL_ENV}`);
  console.log(`[debug] NODE_ENV === ${process?.env?.NODE_ENV}`);
  console.log(`[debug] NEXT_PUBLIC_VERCEL_URL === ${process?.env?.NEXT_PUBLIC_VERCEL_URL}`);
  console.log(`[debug] VERCEL_URL === ${process?.env?.VERCEL_URL}`);
  const url = new URL(urlexpanded, getBaseUrl());
  setUrlParams(url, config.params ?? {}, ctx.parameters);
  
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

function setUrlParams(url: URL, urlParams: Record<string, string>, parameters: Record<string, string | string[]>) {
  for (let [name, paramName] of Object.entries(urlParams)) {
    if (paramName in parameters) {
      const value = parameters[paramName];
      if (Array.isArray(value)) {
        value.forEach((value) => {
          url.searchParams.append(name, value);
        });
        continue;
      }
      value && url.searchParams.set(name, value);
    }
  }
}

function getBaseUrl() {
  const env =
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.VERCEL_ENV ||
    process.env.NODE_ENV;
  const url =
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL ||
    `http://localhost:${process.env.PORT || 3000}`;
  switch (env) {
    case 'production':
      return `https://next.ossinsight.io`;
    case 'preview':
      return process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
    case 'development':
    default:
      return url;
  }
}
