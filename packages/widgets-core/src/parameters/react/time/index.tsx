import * as React from 'react';
import { TimePeriodSelector, TimeZoneSelector } from '@ossinsight/ui';

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
  value: string;
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
        value={value}
        onValueChange={handleValueChange}
      />
    </>
  );
}
