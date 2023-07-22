import { ParameterDefinitions } from '@ossinsight/widgets-types';
import parse from './parser/repo-id';

export type LinkedData = {
  repos: Record<string, { id: number, fullName: string }>
  users: Record<string, { id: number, login: string }>
}

// TODO: use ossinsight api instead of directly visit github
// https://stackoverflow.com/questions/11976393/get-github-username-by-id
export async function resolveParameters (definitions: ParameterDefinitions, params: any) {
  const linkedData: LinkedData = {
    repos: {},
    users: {},
  };
  await Promise.all(Object.entries(definitions).map(([name, def]) => {
    let param = params[name];
    switch (def.type) {
      case 'repo-id':
        if (param) {
          param = parse(param);
          return fetch(`https://api.github.com/repositories/${param}`, {
            cache: 'force-cache',
            headers: {
              Authorization: `Bearer ${(globalThis.process).env.GH_TOKEN}`,
            },
          })
            .then(data => data.json())
            .then(data => linkedData.repos[param] = { id: param, fullName: data.full_name });
        }
        break;
    }

    return Promise.resolve();
  }));

  return linkedData;
}
