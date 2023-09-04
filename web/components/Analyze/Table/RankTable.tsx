'use client';
import * as React from 'react';
import { SingleToggleButtonGroup } from '@ossinsight/ui/src/components/Toggle/ToggleButton';
import { Tabs, Tab } from '@ossinsight/ui/src/components/Tabs';

const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
];

const data = new Array(10)
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
        <Tabs className=''>
          <Tab title='New' value='new'>
            <Table header={['No.', 'Company1', 'Activities']} data={data} />
          </Tab>
          <Tab title='Total' value='total'>
            <Table header={['No.', 'Company2', 'Activities']} data={data} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

function Table(props: {
  data: Array<any>;
  header: Array<string | React.ReactElement>;
}) {
  const { data, header } = props;

  return (
    <div className='mt-1 flow-root'>
      <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
          <table className='min-w-full divide-y divide-gray-700'>
            <thead>
              <tr>
                <th
                  scope='col'
                  className='py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'
                >
                  {header[0]}
                </th>
                {header.slice(1).map((h) => (
                  <th
                    key={h.toString()}
                    scope='col'
                    className='px-3 py-1.5 text-left text-sm font-semibold text-white'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-800'>
              {data.map((row) => (
                <tr key={row[0]}>
                  <td className='whitespace-nowrap py-1 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>
                    {row[0]}
                  </td>
                  <td className='whitespace-nowrap px-3 py-1 text-sm text-gray-300'>
                    {row[1]}
                  </td>
                  <td className='whitespace-nowrap px-3 py-1 text-sm text-gray-300'>
                    {row[2]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
