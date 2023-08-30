import { useCallback } from 'react';
import { GHRepoSelector, RemoteRepoInfo } from '../GHRepoSelector';
import { GHUserSelector, RemoteUserInfo } from '../GHUserSelector';
import { RemoteSelectorInputProps } from '../RemoteSelector';
import { Select, SelectItem } from '../Selector';
import { AnalyzeTuple } from './types';

export interface AnalyzeSelectorProps {
  id?: string;
  tuple: AnalyzeTuple;
  onTupleChange: (tuple: AnalyzeTuple) => void;
}

export function AnalyzeSelector ({ id, tuple, onTupleChange }: AnalyzeSelectorProps) {
  const handleUserSelected = useCallback((user: RemoteUserInfo) => {
    onTupleChange({
      type: 'user',
      value: user,
    });
  }, [onTupleChange]);

  const handleRepoSelected = useCallback((repo: RemoteRepoInfo) => {
    onTupleChange({
      type: 'repo',
      value: repo,
    });
  }, [onTupleChange]);

  const handleTypeChange = useCallback((type: 'user' | 'repo') => {
    onTupleChange({
      type,
      value: undefined,
    });
  }, [onTupleChange]);

  return (
    <div className="TextInput flex items-center divide-x">
      <Select className='Select-borderless' value={tuple.type} onValueChange={handleTypeChange} position='popper'>
        <SelectItem value={'user'}>
          User
        </SelectItem>
        <SelectItem value={'repo'}>
          Repository
        </SelectItem>
      </Select>
      {tuple.type === 'user' && <GHUserSelector id={id} user={tuple.value} onUserSelected={handleUserSelected} compat renderInput={renderInput} />}
      {tuple.type === 'repo' && <GHRepoSelector id={id} repo={tuple.value} onRepoSelected={handleRepoSelected} compat renderInput={renderInput} />}
    </div>
  );
}

function renderInput (props: RemoteSelectorInputProps) {
  return <input {...props} className="text-sm pl-2 flex-1" placeholder='Search...' type={undefined} />;
}
