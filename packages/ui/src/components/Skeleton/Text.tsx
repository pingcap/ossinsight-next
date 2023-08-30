import clsx from 'clsx';
import { CSSProperties, useMemo } from 'react';
import './style.scss';

export interface TextSkeletonProps {
  className?: string;
  visualCharacter?: string;
  characters?: number;
  style?: CSSProperties;
}

export function TextSkeleton ({ className, visualCharacter = '&#8195;', characters = 1000, style }: TextSkeletonProps) {
  const content = useMemo(() => visualCharacter.repeat(characters), [visualCharacter, characters]);
  return (
    <span className={clsx('inline-block', className)} style={style}>
      <span className="inline skeleton rounded select-none" dangerouslySetInnerHTML={{ __html: content }} />
    </span>
  );
}
