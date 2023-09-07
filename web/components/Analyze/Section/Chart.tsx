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
import { twMerge } from 'tailwind-merge';

import { AnalyzeOrgContext } from '@/components/Context/Analyze/AnalyzeOrg';
import { ChartSkeleton } from '@ossinsight/ui/src/components/Skeleton';

export interface ChartTemplateProps {
  name: string;
  searchParams?: Record<string, string>;
  className?: string;
  width?: number;
  height?: number;
}

export default function ChartTemplate(props: ChartTemplateProps) {
  const { name, searchParams = {}, className, width, height } = props;

  const { orgName } = React.useContext(AnalyzeOrgContext);

  const linkedDataMemo = React.useMemo(
    () => makeLinkedData(name, searchParams),
    [name, searchParams]
  );

  const classNameMemo = React.useMemo(
    () =>
      twMerge(
        'relative w-fit h-fit',
        className,
        width && `w-[${width}px]`,
        height && `h-[${height}px]`
      ),
    [className, width, height]
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
      <React.Suspense
        fallback={
          <ChartSkeleton
            style={{
              width: width ? `${width}px` : undefined,
              height: height ? `${height}px` : undefined,
            }}
          />
        }
      >
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
