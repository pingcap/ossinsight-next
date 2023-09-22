import { collectionsPromise } from '@ossinsight/ui/src/components/CollectionSelector/utils';
import { ParameterDefinitions } from '@ossinsight/widgets-types';
import { handleOApi } from '../utils/oapi';
import parsers from './parser';

export type LinkedData = {
  repos: Record<string, { id: number, fullName: string, defaultBranch: string }>
  users: Record<string, { id: number, login: string }>
  orgs: Record<string, { id: number, login: string }>
  collections: Record<string, { id: number, name: string, public: boolean }>
}

export async function resolveParameters (definitions: ParameterDefinitions, params: Record<string, string | string[]>, defaultLinkedData?: LinkedData) {
  const linkedData = defaultLinkedData ?? {
    repos: {},
    users: {},
    orgs: {},
    collections: {},
  };
  const results = await Promise.allSettled(Object.entries(definitions).map(([name, def]) => {
    let originParam: string | number | string[] | number[] = params[name];
    if (originParam == null) {
      return Promise.resolve();
    }
    const parse = parsers[def.type];
    originParam = parse?.(originParam, def as any) ?? originParam;
    const param = typeof originParam === 'object' ? originParam[originParam.length - 1] : originParam;
    switch (def.type) {
      case 'repo-id':
        if (param) {
          if (linkedData.repos[param]) return Promise.resolve();
          return fetch(`https://api.ossinsight.io/gh/repositories/${param}`)
            .then(handleOApi)
            .then((data) => {
              linkedData.repos[param] = {
                id: param as number,
                fullName: data.full_name,
                defaultBranch: data.default_branch,
              };
            });
        }
        break;
      case 'user-id':
        if (param) {
          if (linkedData.users[param]) return Promise.resolve();
          return fetch(`https://api.ossinsight.io/gh/user/${param}`)
            .then(handleOApi)
            .then((data) => {
              linkedData.users[param] = {
                id: param as number,
                login: data.login,
              };
            });
        }
        break;
      case 'owner-id':
        if (param) {
          if (linkedData.orgs[param]) return Promise.resolve();
          return fetch(`https://api.ossinsight.io/gh/user/${param}`)
            .then(handleOApi)
            .then((data) => {
              linkedData.orgs[param] = {
                id: param as number,
                login: data.login,
              };
            });
        }
        break;
      case 'collection-id':
        if (param) {
          if (linkedData.collections[param]) return Promise.resolve();
          return collectionsPromise
            .then(res => res.find(collection => collection.id === param))
            .then(collection => {
              if (collection) {
                linkedData.collections[param] = collection;
              }
            });
        }
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
