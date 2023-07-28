import * as React from 'react';

import { useSimpleSelect } from './Select';
import { generateZoneOptions } from '@ossinsight/widgets-utils/src/ui';

const { DEFAULT_ZONE, ZONE_OPTIONS } = generateZoneOptions();

export interface TimeZoneSelectorProps {
  onValueChange?: (newValue: string) => void;
  showLabel?: boolean;
  defaultValue?: number;
}

export function TimeZoneSelector(props: TimeZoneSelectorProps) {
  const { onValueChange, showLabel = false, defaultValue = 0 } = props;

  const { select: zoneSelect, value: zone } = useSimpleSelect(
    ZONE_OPTIONS,
    ZONE_OPTIONS.find((i) => i.key === defaultValue) ||
      ZONE_OPTIONS[DEFAULT_ZONE],
    showLabel ? 'Zone' : undefined
  );

  React.useEffect(() => {
    onValueChange && onValueChange(zone);
  }, [zone]);

  return <>{zoneSelect}</>;
}
