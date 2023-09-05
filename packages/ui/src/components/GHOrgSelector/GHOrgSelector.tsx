import { RemoteSelector, RemoteSelectorProps } from '../RemoteSelector';
import { GHOrgItem } from './GHOrgItem';
import { GHOrgListItem } from './GHOrgListItem';
import { getUserText, isUserEquals, searchUser } from './utils';

// TODO - RemoteUserInfo => RemoteOrgInfo
export type RemoteUserInfo = {
  id: number;
  login: string;
};

export interface GHUserSelectorProps
  extends Pick<RemoteSelectorProps<any>, 'id' | 'renderInput'> {
  user: RemoteUserInfo | undefined;
  onUserSelected: (repo: RemoteUserInfo | undefined) => void;
  compat?: boolean;
}

// TODO - RemoteUserInfo => RemoteOrgInfo
export function GHOrgSelector({
  user,
  onUserSelected,
  compat,
  ...props
}: GHUserSelectorProps) {
  return (
    <RemoteSelector<RemoteUserInfo>
      {...props}
      getItemText={getUserText}
      value={user ? [user] : []}
      onSelect={onUserSelected}
      getRemoteOptions={searchUser}
      renderSelectedItems={([item]) => (
        <GHOrgItem
          id={props.id}
          item={item}
          compat={compat}
          onClear={() => onUserSelected(undefined)}
        />
      )}
      renderListItem={(props) => (
        <GHOrgListItem key={props.item.id} {...props} />
      )}
      equals={isUserEquals}
    />
  );
}
