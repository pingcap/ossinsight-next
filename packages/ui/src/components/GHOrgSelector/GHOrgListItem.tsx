import clsx from 'clsx';
import { GHAvatar } from '../GHAvatar';
import {
  RemoteSelectItem,
  RemoteSelectorListItemProps,
} from '../RemoteSelector';
import { RemoteUserInfo } from './GHOrgSelector';

// TODO - RemoteSelectorListItemProps<RemoteUserInfo> => RemoteSelectorListItemProps<RemoteOrgInfo>
export function GHOrgListItem({
  item,
  ...props
}: RemoteSelectorListItemProps<RemoteUserInfo>) {
  return (
    <RemoteSelectItem {...props}>
      <GHAvatar name={item.login} size={4} />
      <span className='overflow-hidden whitespace-nowrap text-ellipsis'>
        {item.login}
      </span>
    </RemoteSelectItem>
  );
}
