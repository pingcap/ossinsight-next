import { cancellableFetch } from '../../utils/fetch';
import { CancelablePromise } from '../../utils/promise';
import { unstable_getApiOrigin } from '../../utils/unstable_get_api_origin';
import { RemoteRepoInfo } from './GHRepoSelector';

export function isRepoEquals (a: RemoteRepoInfo, b: RemoteRepoInfo) {
  return a.id === b.id;
}

export function searchRepo (text: string): CancelablePromise<RemoteRepoInfo[]> {
  return cancellableFetch(`${unstable_getApiOrigin()}/gh/repos/search?keyword=${encodeURIComponent(text)}`)
    .then(res => res.json())
    .then(res => res.data);
}

export function getRepoText (repo: RemoteRepoInfo) {
  return repo.fullName;
}
