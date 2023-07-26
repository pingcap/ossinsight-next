import * as React from 'react';

import { useSimpleSelect } from './Select';

const ZONE_OPTIONS: Array<{ key: number; title: string }> = [];

for (let i = -12; i <= 13; i++) {
  ZONE_OPTIONS.push({
    key: i,
    title: i > 0 ? `+${i}` : i === 0 ? '0' : `${i}`,
  });
}

const DEFAULT_ZONE = Math.max(
  Math.min(
    Math.round(12 - new Date().getTimezoneOffset() / 60),
    ZONE_OPTIONS.length - 1
  ),
  0
);

export interface TimeZoneSelectorProps {
  onValueChange?: (newValue: string) => void;
  showLabel?: boolean;
}

export function TimeZoneSelector(props: TimeZoneSelectorProps) {
  const { onValueChange, showLabel = false } = props;

  const { select: zoneSelect, value: zone } = useSimpleSelect(
    ZONE_OPTIONS,
    ZONE_OPTIONS[DEFAULT_ZONE],
    showLabel ? 'Zone' : undefined
  );

  React.useEffect(() => {
    onValueChange && onValueChange(zone);
  }, [zone]);

  return <>{zoneSelect}</>;
}
