'use client';
import * as React from 'react';
import { HeadlessTabs, HeadlessTab } from '@ossinsight/ui/src/components/Tabs';
import { twMerge } from 'tailwind-merge';
import { alpha2ToTitle } from '@ossinsight/widgets-utils/src/geo';

import {
  getOrgActivityLocations,
  getOrgActivityOrgs,
} from '@/components/Analyze/utils';
import Loader from '@/components/Widget/loading';

const mock_data = [
  {
    country_code: 'CN',
    stars: 71,
    percentage: 44.1,
  },
  {
    country_code: 'US',
    stars: 14,
    percentage: 8.7,
  },
  {
    country_code: 'JP',
    stars: 12,
    percentage: 7.45,
  },
  {
    country_code: 'IN',
    stars: 9,
    percentage: 5.59,
  },
  {
    country_code: 'GB',
    stars: 5,
    percentage: 3.11,
  },
  {
    country_code: 'DE',
    stars: 4,
    percentage: 2.48,
  },
  {
    country_code: 'BR',
    stars: 4,
    percentage: 2.48,
  },
  {
    country_code: 'RU',
    stars: 3,
    percentage: 1.86,
  },
  {
    country_code: 'IR',
    stars: 3,
    percentage: 1.86,
  },
  {
    country_code: 'PT',
    stars: 3,
    percentage: 1.86,
  },
  {
    country_code: 'CA',
    stars: 3,
    percentage: 1.86,
  },
  {
    country_code: 'ID',
    stars: 3,
    percentage: 1.86,
  },
  {
    country_code: 'KR',
    stars: 2,
    percentage: 1.24,
  },
  {
    country_code: 'TH',
    stars: 2,
    percentage: 1.24,
  },
  {
    country_code: 'FR',
    stars: 2,
    percentage: 1.24,
  },
  {
    country_code: 'IE',
    stars: 2,
    percentage: 1.24,
  },
  {
    country_code: 'NZ',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'NO',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'DK',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'AU',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'CO',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'BD',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'CD',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'TR',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'PL',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'IL',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'VN',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'AT',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'LV',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'EG',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'NG',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'SG',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'BJ',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'UA',
    stars: 1,
    percentage: 0.62,
  },
  {
    country_code: 'NL',
    stars: 1,
    percentage: 0.62,
  },
];

function Table(props: {
  rows?: Array<Array<string | number>>;
  header?: Array<string>;
  maxRows?: number;
}) {
  const { rows, header, maxRows = 10 } = props;

  return (
    <>
      {/* <div className='mt-1 flow-root'>
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
                          className='whitespace-normal px-3 py-1 text-sm text-gray-300'
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
      </div> */}
      <table className={twMerge('min-w-full divide-y divide-gray-700')}>
        <thead>
          <tr>
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
          {rows?.map((row) => (
            <tr key={row[0]}>
              <td className='whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>
                {row[0]}
              </td>
              {row?.slice(1).map((r) => (
                <td
                  key={r?.toString()}
                  className='whitespace-normal px-3 py-1 text-sm text-gray-300'
                >
                  {r}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function upperFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function TableSkeleton() {
  return <><Loader /></>;
}

export async function GeoRankTablePromise(props: {
  id: number;
  type: 'stars' | 'participants';
  maxRows?: number;
}) {
  const { id, type, maxRows = 10 } = props;

  const data = await getOrgActivityLocations(id, { activity: type });

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
  className?: string;
}) {
  const { id, type = 'stars', className } = props;

  if (!id) {
    return null;
  }

  return (
    <div
      className={twMerge(
        'px-4 sm:px-6 lg:px-8 items-center justify-around',
        className
      )}
    >
      <div className='px-1 text-base font-semibold leading-6 text-white mx-auto w-fit'>
        Top locations
      </div>
      <React.Suspense fallback={<TableSkeleton />}>
        <GeoRankTablePromise id={id} type={type} />
      </React.Suspense>
    </div>
  );
}

export async function CompanyRankTablePromise(props: {
  id: number;
  type: 'stars' | 'participants';
  maxRows?: number;
}) {
  const { id, maxRows = 10, type } = props;

  const data = await getOrgActivityOrgs(id, {
    activity: type,
  });

  const rows = data
    .slice(0, maxRows)
    .map((d: any, idx) => [idx + 1, d.organization_name, d[type]]);

  const header = ['No.', 'Company', upperFirst(type)];

  return (
    <>
      <Table rows={rows} header={header} />
    </>
  );
}

export function CompanyRankTable(props: {
  id?: number;
  type?: 'stars' | 'participants';
  className?: string;
}) {
  const { id, type = 'stars', className } = props;

  if (!id) {
    return null;
  }

  return (
    <div
      className={twMerge(
        'px-4 sm:px-6 lg:px-8 items-center justify-around',
        className
      )}
    >
      <div className='px-1 text-base font-semibold leading-6 text-white mx-auto w-fit'>
        Top companies
      </div>
      <React.Suspense fallback={<TableSkeleton />}>
        <CompanyRankTablePromise id={id} type='stars' />
      </React.Suspense>
    </div>
  );
}
