import * as React from 'react';

import { useSimpleSelect } from './Select';

const PERIOD_OPTIONS = [
  {
    key: 'last_1_year',
    title: 'Last 1 year',
  },
  {
    key: 'last_3_year',
    title: 'Last 3 years',
  },
  {
    key: 'all_times',
    title: 'All times',
  },
];

export interface TimePeriodSelectorProps {
  onValueChange?: (newValue: string) => void;
  showLabel?: boolean;
}

export function TimePeriodSelector(props: TimePeriodSelectorProps) {
  const { onValueChange, showLabel = false } = props;

  const { select: periodSelect, value: period } = useSimpleSelect(
    PERIOD_OPTIONS,
    PERIOD_OPTIONS[0],
    showLabel ? 'Period' : undefined
  );

  React.useEffect(() => {
    onValueChange && onValueChange(period);
  }, [period]);

  return <>{periodSelect}</>;
}
