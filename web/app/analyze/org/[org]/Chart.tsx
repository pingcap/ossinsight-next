'use client';
import * as React from 'react';
import NextLink from 'next/link';
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

  const targetLinkMemo = React.useMemo(() => {
    if (name.includes(`@ossinsight/widget-`)) {
      const widget = name.split('@ossinsight/widget-').pop();
      const searchStr = new URLSearchParams(searchParams).toString();
      return `/widgets/official/${widget}?${searchStr}`;
    }
    return null;
  }, [name, searchParams]);

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
        {targetLinkMemo && (
          <NextLink target='_blank' href={targetLinkMemo}>
            <button className='absolute top-4 right-4'>
              <ArrowUpRightCircleFill />
            </button>
          </NextLink>
        )}
      </React.Suspense>
    </div>
  );
}
