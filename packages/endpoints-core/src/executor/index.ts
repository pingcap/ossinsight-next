import { EndpointConfig } from '../config';

export async function executeEndpoint (name: string, config: EndpointConfig, sql: string, params: Record<string, any>, geo?: any) {
  if (typeof window === 'undefined') {
    let server = await import('./server');
    return await server.default(name, config, sql, params, geo);
  } else {
    let browser = await import('./browser');
    return await browser.default(name, config, sql, params);
  }
}

export { APIError } from './utils'
