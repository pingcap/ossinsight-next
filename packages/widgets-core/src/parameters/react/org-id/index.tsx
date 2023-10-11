import { RemoteSelectorInputProps } from '@ossinsight/ui';
import {
  GHOrgSelector,
  RemoteOrgInfo,
} from '@ossinsight/ui/src/components/GHOrgSelector';
import { useCallback, useContext } from 'react';
import { ParametersContext } from '../context';

export function OrgIdInput({
  id,
  value,
  onValueChange,
}: {
  id: string;
  value: number;
  onValueChange: (newValue: number | undefined) => void;
}) {
  const { linkedData } = useContext(ParametersContext);

  const handleOrgSelected = useCallback((org: RemoteOrgInfo | undefined) => {
    if (org) {
      linkedData.orgs[String(org.id)] = org;
    }
    onValueChange(org?.id);
  }, []);

  const org = linkedData.orgs[String(value)];

  return (
    <GHOrgSelector
      id={id}
      org={org}
      onOrgSelected={handleOrgSelected}
      renderInput={renderInput}
    />
  );
}

function renderInput(props: RemoteSelectorInputProps) {
  return (
    <input
      className='TextInput'
      {...props}
      type={(props as any).type === 'button' ? undefined : (props as any).type}
    />
  );
}
