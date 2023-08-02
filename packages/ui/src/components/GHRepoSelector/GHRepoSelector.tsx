import { RemoteSelector, RemoteSelectorProps } from '../RemoteSelector';
import { GHRepoItem } from './GHRepoItem';
import { GHRepoListItem } from './GHRepoListItem';
import { getRepoText, isRepoEquals, searchRepo } from './utils';

export type RemoteRepoInfo = {
  id: number
  fullName: string
}

export interface GHRepoSelectorProps extends Pick<RemoteSelectorProps<any>, 'renderInput'> {
  repo: RemoteRepoInfo | undefined;
  onRepoSelected: (repo: RemoteRepoInfo | undefined) => void;
}

export function GHRepoSelector ({ repo, renderInput, onRepoSelected }: GHRepoSelectorProps) {
  return (
    <RemoteSelector<RemoteRepoInfo>
      getItemText={getRepoText}
      value={repo ? [repo] : []}
      onSelect={onRepoSelected}
      getRemoteOptions={searchRepo}
      renderInput={renderInput}
      renderSelectedItems={([item]) => <GHRepoItem item={item} onClear={() => onRepoSelected(undefined)} />}
      renderListItem={props => <GHRepoListItem key={props.item.id} {...props} />}
      equals={isRepoEquals}
    />
  );
}
