import * as React from 'react';

import { useSimpleSelect } from './Select';
import { PERIOD_OPTIONS } from '@ossinsight/widgets-utils/src/ui';

export interface TimePeriodSelectorProps {
  onValueChange?: (newValue: string) => void;
  showLabel?: boolean;
  defaultValue?: string;
}

export function TimePeriodSelector(props: TimePeriodSelectorProps) {
  const { onValueChange, showLabel = false, defaultValue } = props;

  const { select: periodSelect, value: period } = useSimpleSelect(
    PERIOD_OPTIONS,
    PERIOD_OPTIONS.find((i) => i.key === defaultValue) || PERIOD_OPTIONS[0],
    showLabel ? 'Period' : undefined
  );

  React.useEffect(() => {
    onValueChange && onValueChange(period);
  }, [period]);

  return <>{periodSelect}</>;
}
