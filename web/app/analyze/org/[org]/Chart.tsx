'use client';
import * as React from 'react';

import {
  makeLinkedData,
  widgetPageParams,
  WidgetPageProps,
} from '@/app/widgets/[vendor]/[name]/utils';
import { ServerWidget } from '@/components/Widget/server';

export default function ChartTemplate(props: {
  name: string;
  searchParams?: Record<string, string>;
  className?: string;
}) {
  const { name, searchParams = {}, className } = props;
  const linkedData = makeLinkedData(name, searchParams);
  return (
    <React.Suspense>
      <ServerWidget
        className='WidgetContainer'
        name={name}
        searchParams={props.searchParams}
        linkedDataPromise={linkedData}
      />
    </React.Suspense>
  );
}
