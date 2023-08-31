'use client';
import * as React from 'react';

import {
  makeLinkedData,
  widgetPageParams,
  WidgetPageProps,
} from '@/app/widgets/[vendor]/[name]/utils';
import { ServerWidget } from '@/components/Widget/server';
import ArrowUpRightCircleFill from 'bootstrap-icons/icons/arrow-up-right-circle-fill.svg';
import clsx from 'clsx';

export default function ChartTemplate(props: {
  name: string;
  searchParams?: Record<string, string>;
  className?: string;
}) {
  const { name, searchParams = {}, className } = props;

  const linkedDataMemo = React.useMemo(
    () => makeLinkedData(name, searchParams),
    [name, searchParams]
  );

  const classNameMemo = React.useMemo(
    () => clsx('relative', className),
    [className]
  );

  return (
    <div className={classNameMemo}>
      <React.Suspense>
        <ServerWidget
          className='WidgetContainer'
          name={name}
          searchParams={searchParams}
          linkedDataPromise={linkedDataMemo}
          showShadow={false}
          showThemeSwitch={false}
          dense
        />
        <button className='absolute top-4 right-4'>
          <ArrowUpRightCircleFill />
        </button>
      </React.Suspense>
    </div>
  );
}
