import clsx from 'clsx';
import { cancellableFetch } from '../../utils/fetch';
import { CancelablePromise } from '../../utils/promise';
import { GHAvatar } from '../GHAvatar';
import { RemoteSelector, RemoteSelectorListItemProps, RemoteSelectorListProps, RemoteSelectorProps } from '../RemoteSelector';

export type RemoteUserInfo = {
  id: number
  login: string
}

export interface GHUserSelectorProps extends Pick<RemoteSelectorProps<any>, 'renderInput'> {
  user: RemoteUserInfo | undefined;
  onUserSelected: (repo: RemoteUserInfo) => void;
}

export function GHUserSelector ({ user, renderInput, onUserSelected }: GHUserSelectorProps) {

  return (
    <RemoteSelector<RemoteUserInfo>
      getItemText={getUserText}
      value={user ? [user] : []}
      onSelect={onUserSelected}
      getRemoteOptions={fetchUserInfo}
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

function isRepoEquals (a: RemoteUserInfo, b: RemoteUserInfo) {
  return a.id === b.id;
}

function fetchUserInfo (text: string): CancelablePromise<RemoteUserInfo[]> {
  return cancellableFetch(`https://api.ossinsight.io/gh/users/search?keyword=${encodeURIComponent(text)}`)
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

function renderListItem ({ item, onClick, disabled, selected }: RemoteSelectorListItemProps<RemoteUserInfo>) {
  return (
    <li className={clsx('flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer transition-colors', selected && 'bg-gray-100')} key={item.id} onClick={onClick}>
      <GHAvatar name={item.login} size={6} />
      <span className="text-gray-700">
        {item.login}
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

function getUserText (repo: RemoteUserInfo) {
  return repo.login;
}
