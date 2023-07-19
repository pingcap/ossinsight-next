import type { WidgetContext } from '@ossinsight/widgets-types';

export default async function executeDatasource (config: any, ctx: WidgetContext) {
  if (config instanceof Array) {
    return Promise.all(config.map(c => executeDatasource(c, ctx)));
  }

  switch (config.type) {
    case 'api':
      return import('./api').then(module => module.default(config, ctx));
  }

  throw new Error(`${config.type} datasource is not supported`);
}
