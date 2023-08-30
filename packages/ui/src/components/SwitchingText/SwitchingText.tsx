'use client';

import { ReactElement, useEffect, useState } from 'react';
import { Pace, WindupChildren } from 'windups';
import { useLatestRef } from '../../hooks/useLatestRef';
import './style.scss';

export interface SwitchingTextProps {
  children: ReactElement[];
}

export function SwitchingText ({ children }: SwitchingTextProps) {
  const [currentIndex, setIndex] = useState(-1);
  const latestChildrenLength = useLatestRef(children.length);

  useEffect(() => {
    setIndex(0);
    const interval = setInterval(() => {
      setIndex(index => (index + 1) % latestChildrenLength.current);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setIndex(index => Math.min(index, children.length - 1));
  }, [children.length]);

  return (
    <>
      {currentIndex >= 0 && (
        <WindupChildren key={currentIndex}>
          <Pace ms={120}>
            {children[currentIndex]}
          </Pace>
        </WindupChildren>
      )}
      <span className="sr-only">
        {children}
      </span>
    </>
  );
}