import { ParameterDefinitions } from '@ossinsight/widgets-types';
import { handleOApi } from '../utils/oapi';
import parsers from './parser';

export type LinkedData = {
  repos: Record<string, { id: number, fullName: string }>
  users: Record<string, { id: number, login: string }>
}

export async function resolveParameters (definitions: ParameterDefinitions, params: any) {
  const linkedData: LinkedData = {
    repos: {},
    users: {},
  };
  const results = await Promise.allSettled(Object.entries(definitions).map(([name, def]) => {
    let param = params[name];
    const parse = parsers[def.type];
    param = parse?.(param) ?? param;
    switch (def.type) {
      case 'repo-id':
        if (param) {
          return fetch(`https://api.ossinsight.io/gh/repositories/${param}`)
            .then(handleOApi)
            .then((data) => linkedData.repos[param] = { id: param, fullName: data.full_name });
        }
        break;
      case 'user-id':
        if (param) {
          return fetch(`https://api.ossinsight.io/gh/user/${param}`)
            .then(handleOApi)
            .then((data) => linkedData.repos[param] = { id: param, fullName: data.full_name });
        }
        break;
    }

    return Promise.resolve();
  }));

  results.forEach(e => {
    if (e.status === 'rejected') {
      console.error(e.reason);
    }
  });

  return linkedData;
}
