import { collectionsPromise } from '@ossinsight/ui/src/components/CollectionSelector/utils';
import { unstable_getApiOrigin } from '@ossinsight/ui/src/utils/unstable_get_api_origin';
import { ParameterDefinitions } from '@ossinsight/widgets-types';
import { handleOApi } from '../utils/oapi';
import parsers from './parser';

export type LinkedData = {
  repos: Record<string, { id: number, fullName: string }>
  users: Record<string, { id: number, login: string }>
  collections: Record<string, { id: number, name: string, public: boolean }>
}

export async function resolveParameters (definitions: ParameterDefinitions, params: any, defaultLinkedData?: LinkedData) {
  const linkedData = defaultLinkedData ?? {
    repos: {},
    users: {},
    collections: {},
  };
  const results = await Promise.allSettled(Object.entries(definitions).map(([name, def]) => {
    let param = params[name];
    if (param == null) {
      return Promise.resolve();
    }
    const parse = parsers[def.type];
    param = parse?.(param, def as any) ?? param;
    switch (def.type) {
      case 'repo-id':
        if (param) {
          if (linkedData.repos[param]) return Promise.resolve();
          return fetch(`${unstable_getApiOrigin()}/gh/repositories/${param}`)
            .then(handleOApi)
            .then((data) => linkedData.repos[param] = { id: param, fullName: data.full_name });
        }
        break;
      case 'user-id':
        if (param) {
          if (linkedData.users[param]) return Promise.resolve();
          return fetch(`${unstable_getApiOrigin()}/gh/user/${param}`)
            .then(handleOApi)
            .then((data) => linkedData.users[param] = { id: param, login: data.login });
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
