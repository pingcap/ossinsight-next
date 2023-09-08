'use client';
import * as React from 'react';
import { HeadlessTabs, HeadlessTab } from '@ossinsight/ui/src/components/Tabs';
import { twMerge } from 'tailwind-merge';
import { alpha2ToTitle } from '@ossinsight/widgets-utils/src/geo';

import {
  getOrgActivityLocations,
  getOrgParticipateOrgs,
} from '@/components/Analyze/utils';

const mock_data = new Array(10)
  .fill(0)
  .map((_, i) => [i + 1, `Company-${i}`, i + 95]);

export default function RankTable(props: any) {
  const [sortBy, setSortBy] = React.useState<'new' | 'total'>('new');

  return (
    <>
      <div className='px-4 sm:px-6 lg:px-8 flex flex-col'>
        <h1 className='px-1 text-base font-semibold leading-6 text-white'>
          Top locations
        </h1>
        <HeadlessTabs categories={['New', 'Total']}>
          <HeadlessTab>
            <Table
              header={['No.', 'Company1', 'Activities']}
              rows={mock_data}
            />
          </HeadlessTab>
          <HeadlessTab>
            <Table
              header={['No.', 'Company2', 'Activities']}
              rows={mock_data}
            />
          </HeadlessTab>
        </HeadlessTabs>
      </div>
    </>
  );
}

function Table(props: {
  rows?: Array<Array<string | number>>;
  header?: Array<string>;
  loading?: boolean;
  maxRows?: number;
}) {
  const { rows, header, loading = false, maxRows = 10 } = props;

  return (
    <div className='mt-1 flow-root'>
      <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
          <table
            className={twMerge(
              'min-w-full divide-y divide-gray-700',
              loading && 'animate-pulse'
            )}
          >
            <thead>
              <tr>
                {loading && header && header?.length <= 0 && (
                  <>
                    <th
                      scope='col'
                      className='py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'
                    >
                      <div className='h-2 w-6 bg-slate-200 dark:bg-slate-700 rounded' />
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-1.5 text-left text-sm font-semibold text-white'
                    >
                      <div className='h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded' />
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-1.5 text-left text-sm font-semibold text-white'
                    >
                      <div className='h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded' />
                    </th>
                  </>
                )}
                <th
                  scope='col'
                  className='py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'
                >
                  {header?.[0]}
                </th>
                {header?.slice(1).map((h) => (
                  <th
                    key={h?.toString()}
                    scope='col'
                    className='px-3 py-1.5 text-left text-sm font-semibold text-white'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-800'>
              {loading &&
                maxRows > 0 &&
                new Array(maxRows).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className='py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'>
                      <div className='my-1 h-2 w-6 bg-slate-200 dark:bg-slate-700 rounded' />
                    </td>
                    <td className='px-3 py-1.5 text-left text-sm font-semibold text-white'>
                      <div className='my-1 h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded' />
                    </td>
                    <td className='px-3 py-1.5 text-left text-sm font-semibold text-white'>
                      <div className='my-1 h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded' />
                    </td>
                  </tr>
                ))}
              {!loading &&
                rows?.map((row) => (
                  <tr key={row[0]}>
                    <td className='whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>
                      {row[0]}
                    </td>
                    {row?.slice(1).map((r) => (
                      <td
                        key={r?.toString()}
                        className='whitespace-nowrap px-3 py-1 text-sm text-gray-300'
                      >
                        {r}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function upperFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function TableSkeleton() {
  return <Table loading />;
}

export async function GeoRankTablePromise(props: {
  id: number;
  type: 'stars' | 'participants';
  maxRows?: number;
}) {
  const { id, type, maxRows = 10 } = props;

  const data = await getOrgActivityLocations(id, { activity: type });

  console.log(data);

  const rows = data
    .slice(0, maxRows)
    .map((d: any, idx: number) => [
      idx + 1,
      alpha2ToTitle(d.country_code),
      d[type],
    ]);

  const header = ['No.', 'Location', upperFirst(type)];

  return (
    <>
      <Table rows={rows} header={header} />
    </>
  );
}

export function GeoRankTable(props: {
  id?: number;
  type?: 'stars' | 'participants';
}) {
  const { id, type = 'stars' } = props;

  if (!id) {
    return null;
  }

  return (
    <div className='px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-around'>
      <h1 className='px-1 text-base font-semibold leading-6 text-white'>
        Top locations
      </h1>
      <React.Suspense fallback={<TableSkeleton />}>
        <GeoRankTablePromise id={id} type={type} />
      </React.Suspense>
    </div>
  );
}

export async function ParticipantCompanyRankTablePromise(props: {
  id: number;
}) {
  const { id } = props;

  const data = await getOrgParticipateOrgs(id);

  const rows = data
    .slice(0, 10)
    .map((d, idx) => [idx + 1, d.organization_name, d.participants]);

  const header = ['No.', 'Company', 'Participants'];

  return (
    <>
      <Table rows={rows} header={header} />
    </>
  );
}

export function ParticipantCompanyRankTable(props: { id?: number }) {
  const { id } = props;

  if (!id) {
    return null;
  }

  return (
    <div className='px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-around'>
      <h1 className='px-1 text-base font-semibold leading-6 text-white'>
        Top companies
      </h1>
      <React.Suspense fallback={<TableSkeleton />}>
        <ParticipantCompanyRankTablePromise id={id} />
      </React.Suspense>
    </div>
  );
}
