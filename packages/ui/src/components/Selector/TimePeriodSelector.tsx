import * as React from 'react';

import { useSimpleSelect } from './Select';
import { PERIOD_OPTIONS } from '@ossinsight/widgets-utils/src/ui';

export interface TimePeriodSelectorProps {
  id?: string
  onValueChange?: (newValue: string) => void;
  defaultValue?: string;
}

export function TimePeriodSelector(props: TimePeriodSelectorProps) {
  const { onValueChange, id, defaultValue } = props;

  const { select: periodSelect, value: period } = useSimpleSelect(
    PERIOD_OPTIONS,
    PERIOD_OPTIONS.find((i) => i.key === defaultValue) || PERIOD_OPTIONS[0],
    id,
  );

  React.useEffect(() => {
    onValueChange && onValueChange(period);
  }, [period]);

  return <>{periodSelect}</>;
}
