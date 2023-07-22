import { GHRepoSelector, RemoteRepoInfo, RemoteSelectorInputProps } from '@ossinsight/ui';
import { useCallback, useContext } from 'react';
import { ParametersContext } from '../context';

export function RepoIdInput ({ value, onValueChange }: { value: number, onValueChange: (newValue: number) => void }) {
  const { linkedData } = useContext(ParametersContext);

  const handleRepoChange = useCallback((repo: RemoteRepoInfo) => {
    linkedData.repos[String(repo.id)] = repo;
    onValueChange(repo.id);
  }, []);

  const repo = linkedData.repos[String(value)];

  return (
    <GHRepoSelector
      repo={repo}
      onRepoSelected={handleRepoChange}
      renderInput={renderInput}
    />
  );
}

function renderInput (props: RemoteSelectorInputProps) {
  return <input className="border rounded outline-none px-2 py-1 text-gray-700" {...props}
                type={(props as any).type === 'button' ? undefined : (props as any).type} />;
}