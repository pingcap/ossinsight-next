import { cache } from 'react';

export function cacheIfBrowser <CachedFunction extends Function>(fn: CachedFunction): CachedFunction {
  if (typeof window === 'undefined') {
    return fn
  } else {
    return cache(fn)
  }
}
