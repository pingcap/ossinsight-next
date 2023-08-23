'use client';
import * as React from 'react';
import NextImage from 'next/image';
import JournalBookmark from 'bootstrap-icons/icons/journal-bookmark.svg';

import {
  AnalyzeOrgContextProps,
  AnalyzeOrgContext,
} from '@/components/Context/Analyze/AnalyzeOrg';
import { Tooltip } from '@ossinsight/ui';

export default function OrgAnalyzePageHeader() {
  const { orgName } =
    React.useContext<AnalyzeOrgContextProps>(AnalyzeOrgContext);

  return (
    <>
      {/* -- header -- */}
      <h1 className='font-semibold text-3xl	text-white'>
        <NextImage
          src={`https://github.com/${orgName}.png`}
          alt={`${orgName} logo`}
          className='inline mr-[10px]'
          width={40}
          height={40}
        />
        {orgName}
      </h1>
      <p className='my-4'>
        TODO The team behind TiDB TiKV, an open source MySQL compatible HTAP
        database
      </p>

      {/* -- status bar -- */}
      <div className='flex items-end gap-6'>
        <LabelItemWithCount
          label='Public repositories'
          count={107}
          icon={<JournalBookmark />}
        />
        <LabelItemWithCount
          label='Participants'
          count={2186}
          icon={<JournalBookmark />}
          description='Individuals involved in repositories under this organization.'
        />
        <LabelItemWithCount
          label='Stars'
          count={34343}
          icon={<JournalBookmark />}
        />
        <div className='ml-auto'>
          <span>Last active at</span>
          <span>37 seconds ago</span>
        </div>
      </div>
      <hr className='my-1 h-[1px] border-t-0 bg-neutral-100 opacity-50' />
    </>
  );
}

const LabelItemWithCount = ({
  label,
  count,
  icon,
  description,
}: {
  label: string;
  count: number;
  icon?: React.ReactNode;
  description?: string;
}) => (
  <div className='flex gap-2 items-center cursor-default'>
    {icon && <div className=''>{icon}</div>}
    <div className=''>{count}</div>
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
