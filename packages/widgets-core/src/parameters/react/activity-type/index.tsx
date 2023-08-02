import { RemoteSelectorInputProps } from '@ossinsight/ui';
import { ActivityTypeSelector } from '@ossinsight/ui/src/components/Selector/ActivityTypeSelector';
import { useCallback } from 'react';

export function ActivityTypeInput ({ id, enums, value, onValueChange }: { id: string, enums?: string[], value: string, onValueChange: (newValue: string) => void }) {

  const handleActivityTypeChange = useCallback((activityType: string) => {
    onValueChange(activityType);
  }, []);

  return (
    <ActivityTypeSelector
      id={id}
      enums={enums}
      onValueChange={handleActivityTypeChange}
      defaultValue={value}
    />
  );
}
