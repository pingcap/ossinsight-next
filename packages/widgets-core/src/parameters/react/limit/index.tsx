import * as React from 'react';
import { useMemo } from 'react';
import { useSimpleSelect } from '@ossinsight/ui/src/components/Selector/Select';

export function LimitInput({
  id,
  onValueChange,
  defaultValue = '30',
}: {
  id: string;
  defaultValue?: string | number;
  onValueChange: (newValue: number | undefined) => void;
}) {
  const options = [
    { key: '30', title: '30' },
    { key: '100', title: '100' },
  ];

  const { select: limitSelect, value: limit } = useSimpleSelect(
    options,
    options.find((i) => i.key === String(defaultValue)) || options[0],
    id
  );

  React.useEffect(() => {
    onValueChange && onValueChange(Number(limit));
  }, [limit]);

  return <>{limitSelect}</>;
}
