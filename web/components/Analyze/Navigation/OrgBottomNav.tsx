'use client';
import * as React from 'react';
// import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@ossinsight/ui/src/components/Button';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg';
import clsx from 'clsx';

import {
  calcPrevNextId,
  navItems,
  DEFAULT_NAV_ID,
} from '@/components/Analyze/Navigation/OrgNav';

export default function OrgBottomNav(props: { org: string }) {
  const { org } = props;

  const pathname = usePathname();
  const router = useRouter();

  const { prevId, nextId, prevItem, nextItem } = React.useMemo(() => {
    const currentID =
      pathname.split(`/${org}`).pop()?.replace('/', '') || DEFAULT_NAV_ID;
    const { prevId, nextId, prevItem, nextItem } = calcPrevNextId(
      navItems,
      currentID
    );
    return { currentID, prevId, nextId, prevItem, nextItem };
  }, [org, pathname]);

  return (
    <>
      <div className='flex items-center justify-between'>
        {prevId && (
          <NavButton
            onClick={() => router.push(`/analyze/org/${org}/${prevId}`)}
            title={prevItem?.title || ''}
            subTitle='Previous'
            icon={<ChevronLeftIcon className='w-4 h-4' />}
          />
        )}
        {nextId && (
          <NavButton
            onClick={() => router.push(`/analyze/org/${org}/${nextId}`)}
            title={nextItem?.title || ''}
            subTitle='Next'
            icon={<ChevronRightIcon className='w-4 h-4' />}
            iconAlign='right'
          />
        )}
      </div>
    </>
  );
}

const NavButton = (props: {
  onClick: () => void;
  title: string;
  subTitle: string;
  icon: React.ReactNode;
  iconAlign?: 'left' | 'right';
}) => {
  const { onClick, title, subTitle, icon, iconAlign = 'left' } = props;

  return (
    <Button
      size='lg'
      variant='primary'
      className={clsx('inline-flex items-center gap-2', {
        'flex-row-reverse ml-auto': iconAlign === 'right',
      })}
      onClick={onClick}
    >
      {icon}
      <div className='flex flex-col items-start'>
        {subTitle && <div className='text-xs'>{subTitle}</div>}
        {title}
      </div>
    </Button>
  );
};
