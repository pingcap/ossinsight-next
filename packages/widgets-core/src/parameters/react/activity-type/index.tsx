import { RemoteSelectorInputProps } from '@ossinsight/ui';
import { ActivityTypeSelector } from '@ossinsight/ui/src/components/Selector/ActivityTypeSelector';
import { useCallback } from 'react';

export function ActivityTypeInput ({ enums, value, onValueChange }: { enums?: string[], value: string, onValueChange: (newValue: string) => void }) {

  const handleActivityTypeChange = useCallback((activityType: string) => {
    onValueChange(activityType);
  }, []);

  return (
    <ActivityTypeSelector
      enums={enums}
      onValueChange={handleActivityTypeChange}
    />
  );
}
