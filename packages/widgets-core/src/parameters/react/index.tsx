import { RepoIdInput } from './repo-id';
import { UserIdInput } from './user-id';
import { TimePeriodSelect, TimeZoneSelect } from './time';
import { ParameterDefinition } from '@ossinsight/widgets-types'

const types = {
  'repo-id': RepoIdInput,
  'user-id': UserIdInput,
  'time-period': TimePeriodSelect,
  'time-zone': TimeZoneSelect,
};

export function ParamInput ({ config, value, onValueChange }: { config: ParameterDefinition, value: any, onValueChange: (value: any) => void }) {
  const Component = types[config.type];
  if (!Component) {
    throw new Error(`Parameter type ${config.type} not supported.`);
  }

  return <Component value={value} onValueChange={onValueChange} />;
}
