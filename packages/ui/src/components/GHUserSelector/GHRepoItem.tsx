import { GHAvatar } from '../GHAvatar';
import { RemoteSelectedItem } from '../RemoteSelector';
import { RemoteUserInfo } from './GHUserSelector';

export function GHUserItem ({ item, onClear }: { item: RemoteUserInfo, onClear: () => void }) {
  return (
    <RemoteSelectedItem onClear={onClear}>
      <GHAvatar name={item.login} size={5} />
      <span className="overflow-hidden whitespace-nowrap text-ellipsis">
        {item.login}
      </span>
    </RemoteSelectedItem>
  );
}
