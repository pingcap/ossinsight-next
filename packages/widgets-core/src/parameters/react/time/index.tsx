import * as React from 'react';
import { TimePeriodSelector, TimeZoneSelector } from '@ossinsight/ui';
import { ParametersContext } from '../context';

export function TimePeriodSelect({
  value,
  onValueChange,
}: {
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
      <TimePeriodSelector onValueChange={handleValueChange} />
    </>
  );
}

export function TimeZoneSelect({
  value,
  onValueChange,
}: {
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
      <TimeZoneSelector onValueChange={handleValueChange} />
    </>
  );
}
