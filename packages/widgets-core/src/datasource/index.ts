import type { WidgetBaseContext } from '@ossinsight/widgets-types';

export default async function executeDatasource (config: any, ctx: WidgetBaseContext) {
  try {
    if (config instanceof Array) {
      return Promise.all(config.map(c => executeDatasource(c, ctx)));
    }

    switch (config.type) {
      case 'api':
        return import('./api').then(module => module.default(config, ctx));
      case 'ref':
        return import('./ref').then(module => module.default(config, ctx));
    }
  } catch (e) {
    console.error(e)
    throw e;
  }

  throw new Error(`${config.type} datasource is not supported`);
}
