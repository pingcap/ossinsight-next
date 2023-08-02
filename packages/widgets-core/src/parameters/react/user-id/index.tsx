import { GHRepoSelector, RemoteRepoInfo, RemoteSelectorInputProps } from '@ossinsight/ui';
import { GHUserSelector, RemoteUserInfo } from '@ossinsight/ui/src/components/GHUserSelector';
import { useCallback, useContext } from 'react';
import { ParametersContext } from '../context';

export function UserIdInput ({ value, onValueChange }: { value: number, onValueChange: (newValue: number) => void }) {
  const { linkedData } = useContext(ParametersContext);

  const handleUserSelected = useCallback((user: RemoteUserInfo | undefined) => {
    if (user) {
      linkedData.users[String(user.id)] = user;
    }
    onValueChange(user?.id);
  }, []);

  const user = linkedData.users[String(value)];

  return (
    <GHUserSelector
      user={user}
      onUserSelected={handleUserSelected}
      renderInput={renderInput}
    />
  );
}

function renderInput (props: RemoteSelectorInputProps) {
  return <input className="TextInput" {...props}
                type={(props as any).type === 'button' ? undefined : (props as any).type} />;
}