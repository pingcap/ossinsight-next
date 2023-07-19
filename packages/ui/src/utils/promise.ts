export interface CancelablePromise<T> extends Promise<T> {
  cancel (): void;
}

export function makeAbortingPromise<T> (promise: Promise<T>, abortController: AbortController): CancelablePromise<T> {
  (promise as CancelablePromise<T>).cancel = () => {
    abortController.abort();
  };

  return promise as CancelablePromise<T>;
}
