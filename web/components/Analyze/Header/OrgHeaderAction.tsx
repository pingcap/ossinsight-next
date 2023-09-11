'use client';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  AnalyzeOrgContextProps,
  AnalyzeOrgContext,
} from '@/components/Context/Analyze/AnalyzeOrg';
import { useSimpleSelect } from '@ossinsight/ui/src/components/Selector/Select';

const options = [
  { key: 'past_28_days', title: 'Past 28 days' },
  { key: 'past_90_days', title: 'Past 90 days' },
  { key: 'past_12_months', title: 'Past 12 months' },
];

export default function OrgAnalyzePageHeaderAction() {
  const { orgName, orgId } =
    React.useContext<AnalyzeOrgContextProps>(AnalyzeOrgContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPeriod = searchParams.get('period') || options[0].key;

  const { select: periodSelect, value: periodSelected } = useSimpleSelect(
    options,
    options.find((i) => i.key === currentPeriod) || options[0],
    'period-select'
  );

  // const updateParamsCallback = React.useCallback(
  //   (newValue: string) => {
  //     const currentParams = new URLSearchParams(
  //       Array.from(searchParams.entries())
  //     );
  //     currentParams.set('period', newValue);
  //     router.push(pathname + '?' + currentParams.toString());
  //   },
  //   [pathname, router, searchParams]
  // );

  React.useEffect(() => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    const currentPeriod = searchParams.get('period') || options[0].key;
    if (currentPeriod !== periodSelected) {
      currentParams.set('period', periodSelected);
      window.location.href = pathname + '?' + currentParams.toString();
    }
  }, [pathname, periodSelected, router, searchParams]);

  return (
    <>
      {/* -- action bar -- */}
      <div className='flex gap-6 flex-wrap flex-col md:flex-row md:items-end'>
        {periodSelect}
      </div>
    </>
  );
}
