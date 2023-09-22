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
    return searchParamsFromUrl.getAll('repoIds') || [];
  }, [searchParamsFromUrl]);

  const [searchParamsMemo, searchParamsStrMemo] = React.useMemo(() => {
    const combinedSearchParams = {
      ...widgetPageParams,
      ...searchParams,
      owner_id: `${orgId}`,
      period: periodMemo,
    };
    const newSearchParams = new URLSearchParams(combinedSearchParams);
    if (repoIdsMemo.length > 0) {
      repoIdsMemo.forEach((repoId) => {
        newSearchParams.append('repo_ids', repoId);
      });
      return [
        { ...combinedSearchParams, repo_ids: repoIdsMemo },
        newSearchParams.toString(),
      ];
    }
    return [combinedSearchParams, newSearchParams.toString()];
  }, [orgId, periodMemo, repoIdsMemo, searchParams]);

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
      return `/widgets/official/${widget}?${searchParamsStrMemo}`;
    }
    return null;
  }, [name, searchParamsStrMemo]);

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
