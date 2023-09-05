import { GHAvatar } from '../GHAvatar';
import {
  RemoteSelectedItem,
  RemoteSelectedItemCommonProps,
} from '../RemoteSelector';
import { RemoteUserInfo } from './GHOrgSelector';

// TODO - item: RemoteUserInfo => item: RemoteOrgInfo
export function GHOrgItem({
  item,
  ...props
}: RemoteSelectedItemCommonProps & { item: RemoteUserInfo }) {
  return (
    <RemoteSelectedItem {...props}>
      <GHAvatar name={item.login} size={4} />
      <span className='overflow-hidden whitespace-nowrap text-ellipsis'>
        {item.login}
      </span>
    </RemoteSelectedItem>
  );
}
