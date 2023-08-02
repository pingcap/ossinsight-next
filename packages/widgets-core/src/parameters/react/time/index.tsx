import * as React from 'react';
import { TimePeriodSelector, TimeZoneSelector } from '@ossinsight/ui';
import { ParametersContext } from '../context';

export function TimePeriodSelect({
  id,
  value,
  onValueChange,
}: {
  id: string
  value: any;
  onValueChange: (newValue: string) => void;
}) {
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      onValueChange(newValue);
    },
    [onValueChange]
  );

  return (
    <>
      <TimePeriodSelector
        id={id}
        defaultValue={value}
        onValueChange={handleValueChange}
      />
    </>
  );
}

export function TimeZoneSelect({
  id,
  value,
  onValueChange,
}: {
  id: string;
  value: any;
  onValueChange: (newValue: string) => void;
}) {
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      onValueChange(newValue);
    },
    [onValueChange]
  );

  return (
    <>
      <TimeZoneSelector
        id={id}
        defaultValue={value}
        onValueChange={handleValueChange}
      />
    </>
  );
}
