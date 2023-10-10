import { useSafeCallback } from '@/components/EmbeddedWidget/useSafeCallback';
import { useShouldPerformNetworkRequests } from '@/utils/useShouldPerformNetworkRequests';
import { useEffect, useRef, useState } from 'react';

type AsyncFunctionWithSignal<Args extends any[], Result> = (...args: [...Args, signal?: AbortSignal | undefined]) => Promise<Result>

export function usePerformanceOptimizedNetworkRequest<Args extends any[], Result> (
  fn: AsyncFunctionWithSignal<Args, Result>,
  ...args: Args
) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Result>();
  const [error, setError] = useState<unknown>();

  const { ref, value: shouldStartLoad } = useShouldPerformNetworkRequests();

  const startedReloadAtRef = useRef(0);

  const { callback, abort } = useSafeCallback(async signal => {
    setLoading(true);
    startedReloadAtRef.current = Date.now();
    try {
      const result = await fn(...args, signal);
      setResult(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    return () => {
      startedReloadAtRef.current = 0;
    };
  }, [JSON.stringify(args)]);

  useEffect(() => {
    if (shouldStartLoad) {
      if (startedReloadAtRef.current) {
        return;
      }
      callback();
    } else {
      if (Date.now() - startedReloadAtRef.current < 200) {
        abort('dismiss too fast');
        startedReloadAtRef.current = 0;
        return;
      }
    }
  }, [shouldStartLoad]);

  return {
    result,
    loading,
    error,
    ref,
  };
}