'use client';
import { useScrollspyContext } from '@/components/Scrollspy/ScrollspyContext';
import { useContext, useEffect, useState } from 'react';

export function useScrollspyCurrentSection () {
  const spy = useScrollspyContext();
  const [current, setCurrent] = useState(spy.currentSection);

  useEffect(() => {
    spy.subscribe(setCurrent);
    return () => {
      spy.unsubscribe(setCurrent);
    };
  }, [spy]);

  return current;
}