import { GHRepoSelector, RemoteRepoInfo, RemoteSelectorInputProps } from '@ossinsight/ui';
import { useCallback, useContext } from 'react';
import { ParametersContext } from '../context';

export function RepoIdInput ({ id, value, onValueChange }: { id: string, value: number, onValueChange: (newValue: number | undefined) => void }) {
  const { linkedData } = useContext(ParametersContext);

  const handleRepoChange = useCallback((repo: RemoteRepoInfo | undefined) => {
    if (repo) {
      linkedData.repos[String(repo.id)] = repo;
    }
    onValueChange(repo?.id);
  }, []);

  const repo = linkedData.repos[String(value)];

  return (
    <GHRepoSelector
      id={id}
      repo={repo}
      onRepoSelected={handleRepoChange}
      renderInput={renderInput}
    />
  );
}

function renderInput (props: RemoteSelectorInputProps) {
  return <input className="TextInput" {...props}
                type={(props as any).type === 'button' ? undefined : (props as any).type} />;
}