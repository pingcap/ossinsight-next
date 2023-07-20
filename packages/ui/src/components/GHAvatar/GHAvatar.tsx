import * as RuiAvatar from '@radix-ui/react-avatar';
import { AvatarSkeleton } from '../Skeleton';

export interface GHAvatarProps {
  name: string;
  size: number;
}

export function GHAvatar ({ name, size = 8 }: GHAvatarProps) {
  size = size || 8;

  return (
    <RuiAvatar.Root>
      <RuiAvatar.Fallback asChild>
        <AvatarSkeleton size={size} />
      </RuiAvatar.Fallback>
      <RuiAvatar.Image
        className={`block rounded-full`}
        style={{
          width: `${size * 0.25}rem`,
          height: `${size * 0.25}rem`,
        }}
        src={getAvatarUrl(name)}
        alt={`Avatar for ${name}`}
      />
    </RuiAvatar.Root>
  );
}

function getAvatarUrl (name: string) {
  name = name.split('/')[0];
  return `https://github.com/${name}.png`;
}
