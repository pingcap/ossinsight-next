import { EndpointConfig } from '../config';
import { prepareQueryContext } from './utils';

export default async function executeEndpoint (name: string, config: EndpointConfig, sql: string, params: Record<string, any>) {
  const context = prepareQueryContext(config, params);
  const usp = new URLSearchParams();

  Object.entries(context).forEach(([name, value]) => {
    if (value instanceof Array) {
      value.forEach(value => {
        usp.append(name, String(value));
      });
    } else {
      usp.set(name, String(value));
    }
  });

  const response = await fetch(`/api/query/${name}?${usp.toString()}`);
  return await response.json();
}