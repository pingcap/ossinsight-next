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

export default async function executeApiDatasource (config: ApiDatasourceConfig, ctx: WidgetBaseContext) {
  if (!allExists(config.when, ctx.parameters)) {
    return null;
  }

  const template = parseTemplate(config.url);
  const url = new URL(template.expand(ctx.parameters));
  setUrlParams(url, config.params ?? {}, ctx.parameters);

  const response = await fetch(url);

  if (!response.ok) {
    throw new HttpRequestError(response, await response.json());
  }

  const data = await response.json();

  const res = jp.query(data, config.parser.extract);
  console.log(config.parser);
  if (config.parser.single) {
    return res[0];
  } else {
    return res;
  }
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

function setUrlParams (url: URL, urlParams: Record<string, string>, parameters: Record<string, string>) {
  for (let [name, paramName] of Object.entries(urlParams)) {
    if (paramName in parameters) {
      url.searchParams.set(name, parameters[paramName]);
    }
  }
}
