'use client';
import * as React from 'react';
import { HeadlessTabs, HeadlessTab } from '@ossinsight/ui/src/components/Tabs';
import { twMerge } from 'tailwind-merge';
import { alpha2ToTitle } from '@ossinsight/widgets-utils/src/geo';

import {
  ParticipantLocationDataType,
  ParticipateOrgDataType,
  StarLocationDataType,
  StarOrgDataType,
  getOrgActivityLocations,
  getOrgActivityOrgs,
} from '@/components/Analyze/utils';
import Loader from '@/components/Widget/loading';

function Table(props: {
  rows?: Array<Array<string | number>>;
  header?: Array<string>;
  maxRows?: number;
}) {
  const { rows, header, maxRows = 10 } = props;

  return (
    <>
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
  return (
    <>
      <Loader />
    </>
  );
}

export function GeoRankTableContent(props: {
  id: number;
  type: 'stars' | 'participants';
  role?: string;
  maxRows?: number;
}) {
  const { id, type, maxRows = 10, role } = props;

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<
    StarLocationDataType[] | ParticipantLocationDataType[]
  >([]);

  React.useEffect(() => {
    const handler = async () => {
      const data = await getOrgActivityLocations(id, {
        activity: type,
        ...(role && { role }),
      });
      setData(data);
      setLoading(false);
    };
    handler();
  }, [id, type, role]);

  const rowsMemo = React.useMemo(() => {
    return data
      .slice(0, maxRows)
      .map((d: any, idx: number) => [
        idx + 1,
        alpha2ToTitle(d.country_code),
        d[type],
      ]);
  }, [data, maxRows, type]);

  const headerMemo = React.useMemo(() => {
    return ['No.', 'Location', upperFirst(type)];
  }, [type]);

  return (
    <>
      {loading ? (
        <TableSkeleton />
      ) : (
        <Table rows={rowsMemo} header={headerMemo} />
      )}
    </>
  );
}

export function GeoRankTable(props: {
  id?: number;
  type?: 'stars' | 'participants';
  role?: string;
  className?: string;
}) {
  const { id, type = 'stars', className, role } = props;

  if (!id) {
    return null;
  }

  return (
    <div className={twMerge('px-1 items-center justify-around', className)}>
      <div className='px-1 text-base font-semibold leading-6 text-white mx-auto w-fit'>
        Top locations
      </div>
      <GeoRankTableContent id={id} type={type} role={role} />
    </div>
  );
}

export function CompanyRankTableContent(props: {
  id: number;
  type: 'stars' | 'participants';
  role?: string;
  maxRows?: number;
}) {
  const { id, maxRows = 10, type, role } = props;
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<
    ParticipateOrgDataType[] | StarOrgDataType[]
  >([]);

  React.useEffect(() => {
    const handler = async () => {
      const data = await getOrgActivityOrgs(id, {
        activity: type,
        ...(role && { role }),
      });
      setData(data);
      setLoading(false);
    };
    handler();
  }, [id, type, role]);

  const rowsMemo = React.useMemo(() => {
    return data
      .slice(0, maxRows)
      .map((d: any, idx: number) => [idx + 1, d.organization_name, d[type]]);
  }, [data, maxRows, type]);

  const headerMemo = React.useMemo(() => {
    return ['No.', 'Company', upperFirst(type)];
  }, [type]);

  return (
    <>
      {loading ? (
        <TableSkeleton />
      ) : (
        <Table rows={rowsMemo} header={headerMemo} />
      )}
    </>
  );
}

export function CompanyRankTable(props: {
  id?: number;
  type?: 'stars' | 'participants';
  role?: string;
  className?: string;
}) {
  const { id, type = 'stars', className, role } = props;

  if (!id) {
    return null;
  }

  return (
    <div className={twMerge('px-1 items-center justify-around', className)}>
      <div className='px-1 text-base font-semibold leading-6 text-white mx-auto w-fit'>
        Top companies
      </div>
      <CompanyRankTableContent id={id} type='stars' role={role} />
    </div>
  );
}
