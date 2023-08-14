import { ActivityTypeSelector } from '@ossinsight/ui/src/components/Selector/ActivityTypeSelector';
import { EventTypeSelector } from '@ossinsight/ui/src/components/Selector/EventTypeSelector';
import { ParameterDefinition } from '@ossinsight/widgets-types';
import { CollectionIdInput } from './collection-id';
import { RepoIdInput } from './repo-id';
import { TimePeriodSelect, TimeZoneSelect } from './time';
import { UserIdInput } from './user-id';

const types = {
  'repo-id': RepoIdInput,
  'user-id': UserIdInput,
  'collection-id': CollectionIdInput,
  'time-period': TimePeriodSelect,
  'time-zone': TimeZoneSelect,
  'activity-type': ActivityTypeSelector,
  'event-type': EventTypeSelector,
};

export function ParamInput ({ id, config, value, onValueChange }: { id: string, config: ParameterDefinition, value: any, onValueChange: (value: any) => void }) {
  const Component = types[config.type];
  if (!Component) {
    // throw new Error(`Parameter type ${config.type} not supported.`);
    return <span>{value}</span>;
  }

  const otherProps: any = {
    id,
  };
  if ('enums' in config) {
    otherProps.enums = config.enums;
  }

  return <Component value={value} onValueChange={onValueChange} {...otherProps} />;
}
