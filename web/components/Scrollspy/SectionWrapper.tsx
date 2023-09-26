import { useScrollspyContext } from './ScrollspyContext';
import { cloneElement, ReactElement, RefAttributes, useContext, useEffect, useRef } from 'react';

export function ScrollspySectionWrapper ({ id, children }: { id?: string, children: ReactElement<RefAttributes<HTMLDivElement>> }) {
  const spy = useScrollspyContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id != null && ref.current) {
      spy.register(id, ref.current);
      return () => {
        spy.unregister(id);
      };
    }
  }, [id, spy]);

  if (id != null) {
    return cloneElement(children, {
      ref,
    });
  } else {
    return children;
  }
}
