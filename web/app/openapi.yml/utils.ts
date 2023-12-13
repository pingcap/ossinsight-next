import { Liquid } from 'liquidjs';
import path from 'path';
import { fileURLToPath } from 'url';

export type TemplateParameter = {
  name: string
  in: 'query' | 'path'
  required: 'true' | 'false'
  description: string
  type: 'string' | 'number' | 'boolean'
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

export async function compile (scope: { widgets: TemplateScope[] }): Promise<string> {
  const tmplPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'openapi.yml.liquid');
  const tmpl = await liquid.parseFile(tmplPath);
  return await liquid.render(tmpl, scope);
}
