declare module '@ossinsight/endpoints' {
  type Endpoint = { config: import('@ossinsight/endpoints-core').EndpointConfig, sql: string };

  export default function loadEndpoint (name: string): Promise<Endpoint>

  export function hasEndpoint (name: string): boolean
}