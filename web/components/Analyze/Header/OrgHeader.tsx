'use client';
import * as React from 'react';
import NextImage from 'next/image';
import CircleFill from 'bootstrap-icons/icons/circle-fill.svg';
import { RepoIcon, StarIcon, PeopleIcon } from '@primer/octicons-react';

import {
  AnalyzeOrgContextProps,
  AnalyzeOrgContext,
} from '@/components/Context/Analyze/AnalyzeOrg';
import { Tooltip } from '@ossinsight/ui';
import { twMerge } from 'tailwind-merge';

import { useOrgOverview } from '@/components/Analyze/hooks';

export default function OrgAnalyzePageHeader() {
  const { orgName, orgId } =
    React.useContext<AnalyzeOrgContextProps>(AnalyzeOrgContext);

  const { data, loading, error, finishedAt } = useOrgOverview(orgId, orgName);

  return (
    <>
      {/* -- header -- */}
      <h1 className='font-semibold text-3xl	text-title'>
        <NextImage
          src={`https://github.com/${orgName}.png`}
          alt={`${orgName} logo`}
          className='inline mr-[10px]'
          width={40}
          height={40}
        />
        {orgName}
      </h1>
      <p className='my-4'>{data?.bio || ''}</p>

      {/* -- status bar -- */}
      <div className='flex gap-6 flex-wrap flex-col md:flex-row md:items-end'>
        <LabelItemWithCount
          label='Public repositories'
          loading={loading}
          count={data?.repos || 0}
          icon={<RepoIcon />}
        />
        <LabelItemWithCount
          label='Participants'
          loading={loading}
          count={data?.participants || 0}
          icon={<PeopleIcon />}
          description='Individuals involved in repositories under this organization.'
        />
        <LabelItemWithCount
          label='Stars'
          loading={loading}
          count={data?.stars || 0}
          icon={<StarIcon />}
        />
        <div className='ml-auto inline-flex gap-2 items-center'>
          <CircleFill className='text-title w-2 h-2' />
          <span>Last active at</span>
          {loading && <ValueSkeleton />}
          {!loading && finishedAt && (
            <span className='text-title'>{`${beautifySeconds(
              calcDateDiff(finishedAt)
            )} ago`}</span>
          )}
        </div>
      </div>

      {/* -- divider -- */}
      <hr className='my-1 h-[1px] border-t-0 bg-neutral-100 opacity-50' />
    </>
  );
}

const LabelItemWithCount = ({
  label,
  count,
  icon,
  description,
  loading = true,
}: {
  label: string;
  count: number;
  icon?: React.ReactNode;
  description?: string;
  loading?: boolean;
}) => {
  return (
    <div className='flex gap-2 items-center cursor-default'>
      {icon && <div className=''>{icon}</div>}
      {!loading && <div className='text-title'>{count}</div>}
      {loading && <ValueSkeleton />}
      <div className='inline-flex items-center'>
        {label}
        {description && (
          <Tooltip.InfoTooltip
            iconProps={{
              className: 'inline ml-1',
              width: 12,
              height: 12,
            }}
          >
            {description}
          </Tooltip.InfoTooltip>
        )}
      </div>
    </div>
  );
};

const ValueSkeleton = (props: { className?: string }) => {
  const { className } = props;
  return (
    <div
      className={twMerge(
        'text-title animate-pulse h-4 w-6 bg-slate-200 dark:bg-slate-700 rounded',
        className
      )}
    ></div>
  );
};

const calcDateDiff = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff / 1000;
};

const beautifySeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days.toFixed(0)} days`;
  } else if (hours > 0) {
    return `${hours.toFixed(0)} hours`;
  } else if (minutes > 0) {
    return `${minutes.toFixed(0)} minutes`;
  } else {
    return `${seconds.toFixed(0)} seconds`;
  }
};
