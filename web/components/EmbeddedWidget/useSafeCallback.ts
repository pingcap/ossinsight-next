import { useLatestValue } from '@ossinsight/ui/src/hooks/useLatestValue';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Wrap a function with abort controller.
 *
 * The abort method will be called when:
 * - User call from the returned `abort` function
 * - (Automatically) Component unmounted
 * - (Automatically) Re-call the function
 *
 * @param fn
 */
export function useSafeCallback<Fn extends (...args: any[]) => any> (fn: (signal: AbortSignal, ...args: Parameters<Fn>) => ReturnType<Fn>) {
  const acRef = useRef<AbortController>();
  const latestFn = useLatestValue(fn);

  const callback = useCallback((...args: Parameters<Fn>) => {
    if (acRef.current) {
      acRef.current?.abort('re-call');
    }
    const ac = acRef.current = new AbortController();

    return latestFn(ac.signal, ...args);
  }, []);

  useEffect(() => {
    return () => {
      acRef.current?.abort('unmount');
    };
  }, []);

  const abort = useCallback((reason?: any) => {
    acRef.current?.abort(reason);
  }, []);

  return {
    callback,
    abort,
  };
}