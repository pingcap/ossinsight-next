import { Liquid } from 'liquidjs';
import { stringify } from 'yaml';
import template from './openapi.yml.liquid';

export type TemplateParameter = {
  name: string
  in: 'query' | 'path'
  required: 'true' | 'false'
  description: string
  schema: object
  extra?: object
}

export type TemplateScope = {
  group: string
  title: string
  description: string
  normalized_name: string
  manifest: {
    id: string
    summary: string
    description: string
  }
  parameters: TemplateParameter[]
}

const liquid = new Liquid();
liquid.registerFilter('quote', value => {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  return JSON.stringify(String(value));
});

liquid.registerFilter('yaml', function (value, tabs) {
  if (!value) {
    return '';
  }

  const pfx = '  '.repeat(parseInt(tabs || 0));
  return '\n' + stringify(value)
    .split('\n')
    .map(line => line ? `${pfx}${line}` : line)
    .join('\n');
});

export async function compile (scope: { widgets: TemplateScope[] }): Promise<string> {
  const tmpl = await liquid.parse(template);
  return await liquid.render(tmpl, scope);
}
