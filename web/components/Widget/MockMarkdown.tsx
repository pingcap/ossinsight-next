import { ParagraphSkeleton } from '@ossinsight/ui/src/components/Skeleton';
import ListIcon from 'bootstrap-icons/icons/list-ul.svg';
import { ReactNode } from 'react';
import { twJoin } from 'tailwind-merge';

export function MockMarkdown ({ className, children }: { className?: string, children: ReactNode }) {
  return (
    <div className={twJoin('bg-black rounded-md', className)}>
      <div className="border-b py-2 px-4 text-sm text-content flex items-center gap-2">
        <ListIcon width={14} />
        <span>
          README.md
        </span>
      </div>
      <div className="p-8">
        <p className="text-base font-bold text-white border-b mb-4 pb-2">README.md</p>
        <ParagraphSkeleton characters={137} />
        <br />
        {children}
        <br />
        <ParagraphSkeleton characters={33} />
      </div>
    </div>
  );
}