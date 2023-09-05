import { cancellableFetch } from '../../utils/fetch';
import { CancelablePromise } from '../../utils/promise';
import { RemoteUserInfo } from './GHOrgSelector';

export function isUserEquals(a: RemoteUserInfo, b: RemoteUserInfo) {
  return a.id === b.id;
}

// TODO: update this api to use the orgs api
export function searchUser(text: string): CancelablePromise<RemoteUserInfo[]> {
  return cancellableFetch(
    `https://api.ossinsight.io/gh/users/search?keyword=${encodeURIComponent(
      text
    )}`
  )
    .then((res) => res.json())
    .then((res) => res.data);
}

export function getUserText(repo: RemoteUserInfo) {
  return repo.login;
}
