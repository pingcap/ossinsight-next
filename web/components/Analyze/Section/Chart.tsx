'use client';
import { widgetPageParams } from '@/app/widgets/[vendor]/[name]/utils';

import { EmbeddedWidget } from '@/components/EmbeddedWidget';
import { ArrowUpRightIcon, CodeIcon } from '@primer/octicons-react';
import NextLink from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

import { AnalyzeOrgContext } from '@/components/Context/Analyze/AnalyzeOrg';

export interface ChartTemplateProps {
  name: string;
  searchParams?: Record<string, string>;
  className?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  innerSectionId?: string;
}

export default function ChartTemplate (props: ChartTemplateProps) {
  const {
    name,
    searchParams = {},
    className,
    width,
    height,
    children,
    innerSectionId,
  } = props;

  const { orgName, orgId } = React.useContext(AnalyzeOrgContext);
  const searchParamsFromUrl = useSearchParams();
  const pathname = usePathname();

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

  const classNameMemo = React.useMemo(
    () =>
      twMerge(
        'relative w-fit h-fit',
        className,
      ),
    [className]
  );

  const [targetWidgetLinkMemo, targetSectionLinkMemo] = React.useMemo(() => {
    let targetWidgetLink = null;
    let targetSectionLink = null;
    if (name.includes(`@ossinsight/widget-`)) {
      const widget = name.split('@ossinsight/widget-').pop();
      targetWidgetLink = `/widgets/official/${widget}?${searchParamsStrMemo}`;
    }
    if (innerSectionId) {
      targetSectionLink = `${pathname}?${searchParamsStrMemo}#${innerSectionId}`;
    }
    return [targetWidgetLink, targetSectionLink];
  }, [innerSectionId, name, pathname, searchParamsStrMemo]);

  return (
    <div
      className={classNameMemo}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      <EmbeddedWidget
        className="WidgetContainer"
        name={name}
        params={searchParamsMemo}
      />
      <div className="absolute top-4 right-4 flex gap-2">
        {targetSectionLinkMemo && (
          <NextLink
            href={targetSectionLinkMemo}
            className="w-4 h-4 rounded-full inline-flex text-[#D9D9D9] items-center justify-center"
          >
            <ArrowUpRightIcon className="w-3 h-3" />
          </NextLink>
        )}
        {targetWidgetLinkMemo && (
          <NextLink
            target="_blank"
            href={targetWidgetLinkMemo}
            className="w-4 h-4 rounded-full inline-flex text-[#D9D9D9] items-center justify-center"
          >
            <CodeIcon className="w-3 h-3" />
          </NextLink>
        )}
      </div>
      {children}
    </div>
  );
}
