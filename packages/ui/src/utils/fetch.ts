import { makeAbortingPromise } from './promise';

export function cancellableFetch (info: RequestInfo | URL, init?: Omit<RequestInit, 'signal'>) {
  const controller = new AbortController();
  const response = fetch(info, init);

  return makeAbortingPromise(response, controller);
}
