'use client';
import * as React from 'react';
import { SingleToggleButtonGroup } from '@ossinsight/ui/src/components/Toggle/ToggleButton';

export default function RankTable(props: any) {
  const [sortBy, setSortBy] = React.useState<'new' | 'total'>('new');

  return (
    <div className='flex flex-col items-center justify-between'>
      <h2 className='text-2xl font-bold'>Top Companies</h2>
      <SingleToggleButtonGroup
        value={sortBy}
        onValueChange={(value) => setSortBy(value as any)}
        items={[
          {
            id: 'new',
            label: sortBy === 'new' ? '⬇️ New' : 'New',
            value: 'new',
            className: 'px-4',
            disabled: sortBy === 'new',
          },
          {
            id: 'total',
            label: sortBy === 'total' ? '⬇️ Total' : 'Total',
            value: 'total',
            className: 'px-4',
            disabled: sortBy === 'total',
          },
        ]}
        className=''
      />
      <table className='table-auto'>
        <thead>
          {/* <tr>
            <th>Top Companies</th>
          </tr> */}
        </thead>
        <tbody>
          {new Array(10).fill(0).map((_, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td className='px-4'>Company-{i}</td>
              <td className='text-end'>{i + 95}⬆️</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
