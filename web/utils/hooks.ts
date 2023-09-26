import { Ref, RefObject, useEffect, useState, useSyncExternalStore } from 'react';

export function useOnline () {
  return useSyncExternalStore(
    cb => {
      window.addEventListener('online', cb);

      return () => {
        window.removeEventListener('online', cb);
      };
    },
    () => window.navigator.onLine,
    () => true);
}

export function useDocumentVisible () {
  return useSyncExternalStore(
    cb => {
      document.addEventListener('visibilitychange', cb);
      return () => document.removeEventListener('visibilitychange', cb);
    },
    () => document.visibilityState !== 'hidden',
    () => true,
  );
}

export function useVisible (ref: RefObject<any>, defaultVisible = true) {
  const [visible, setVisible] = useState(defaultVisible);

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      setVisible(entry.intersectionRatio > 0);
    });
    io.observe(ref.current);
    return () => {
      io.disconnect();
    };
  }, [ref]);

  return visible;
}
