'use client';
import * as React from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  makeLinkedData,
  widgetPageParams,
  WidgetPageProps,
} from '@/app/widgets/[vendor]/[name]/utils';
import { ClientWidget } from '@/components/Analyze/Section/ClientWidget';
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
  children?: React.ReactNode;
}

export default function ChartTemplate(props: ChartTemplateProps) {
  const { name, searchParams = {}, className, width, height, children } = props;

  const { orgName, orgId } = React.useContext(AnalyzeOrgContext);
  const searchParamsFromUrl = useSearchParams();

  const periodMemo = React.useMemo(() => {
    return searchParamsFromUrl.get('period') || 'past_28_days';
  }, [searchParamsFromUrl]);

  const repoIdsMemo = React.useMemo(() => {
    const repoIdsStr = searchParamsFromUrl.get('repoIds') || '';
    // return repoIdsStr.split(',').reduce((acc, cur) => {
    //   if (cur) {
    //     try {
    //       const tmp = Number.parseInt(cur.trim());
    //       if (!Number.isNaN(tmp)) {
    //         acc.push(tmp);
    //       }
    //     } catch (error) {}
    //   }
    //   return acc;
    // }, [] as number[]);
    return repoIdsStr;
  }, [searchParamsFromUrl]);

  const searchParamsMemo = React.useMemo(
    () => ({
      ...widgetPageParams,
      ...searchParams,
      owner_id: `${orgId}`,
      period: periodMemo,
      ...(repoIdsMemo.length > 0 && { repo_ids: repoIdsMemo }),
    }),
    [orgId, periodMemo, repoIdsMemo, searchParams]
  );

  const linkedDataMemo = React.useMemo(
    () => makeLinkedData(name, searchParamsMemo),
    [name, searchParamsMemo]
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
      const searchStr = new URLSearchParams(searchParamsMemo).toString();
      return `/widgets/official/${widget}?${searchStr}`;
    }
    return null;
  }, [name, searchParamsMemo]);

  return (
    <div
      className={classNameMemo}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      <ClientWidget
        className='WidgetContainer'
        name={name}
        searchParams={searchParamsMemo}
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
      {children}
    </div>
  );
}
