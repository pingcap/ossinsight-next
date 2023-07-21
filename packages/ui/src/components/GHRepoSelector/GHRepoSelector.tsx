import clsx from 'clsx';
import { cancellableFetch } from '../../utils/fetch';
import { CancelablePromise } from '../../utils/promise';
import { GHAvatar } from '../GHAvatar';
import { RemoteSelector, RemoteSelectorListItemProps, RemoteSelectorListProps, RemoteSelectorProps } from '../RemoteSelector';

export type RemoteRepoInfo = {
  id: number
  fullName: string
}

export interface GHRepoSelectorProps extends Pick<RemoteSelectorProps<any>, 'renderInput'> {
  repo: RemoteRepoInfo | undefined;
  onRepoSelected: (repo: RemoteRepoInfo) => void;
}

export function GHRepoSelector ({ repo, renderInput, onRepoSelected }: GHRepoSelectorProps) {

  return (
    <RemoteSelector<RemoteRepoInfo>
      getItemText={getRepoText}
      value={repo ? [repo] : []}
      onSelect={onRepoSelected}
      getRemoteOptions={fetchRepoInfo}
      renderInput={renderInput}
      renderList={renderList}
      renderListItem={renderListItem}
      renderLoading={renderLoading}
      renderEmpty={renderEmpty}
      renderError={renderError}
      equals={isRepoEquals}
    />
  );
}

function isRepoEquals (a: RemoteRepoInfo, b: RemoteRepoInfo) {
  return a.id === b.id;
}

function fetchRepoInfo (text: string): CancelablePromise<RemoteRepoInfo[]> {
  return cancellableFetch(`https://api.ossinsight.io/gh/repos/search?keyword=${encodeURIComponent(text)}`)
    .then(res => res.json())
    .then(res => res.data);
}

function renderList ({ children }: RemoteSelectorListProps) {
  return (
    <ul>
      {children}
    </ul>
  );
}

function renderListItem ({ item, onClick, disabled, selected }: RemoteSelectorListItemProps<RemoteRepoInfo>) {
  return (
    <li className={clsx('flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer transition-colors', selected && 'bg-gray-100')} key={item.id} onClick={onClick}>
      <GHAvatar name={item.fullName} size={6} />
      <span className="text-gray-700">
        {item.fullName}
      </span>
    </li>
  );
}

function renderLoading () {
  return <div className="p-2 text-gray-400">Loading...</div>;
}

function renderEmpty () {
  return <div className="p-2 text-gray-400">Empty result</div>;
}

function renderError (error: unknown) {
  return <div className="p-2 text-red-700">Failed to load</div>;
}

function getRepoText (repo: RemoteRepoInfo) {
  return repo.fullName;
}
