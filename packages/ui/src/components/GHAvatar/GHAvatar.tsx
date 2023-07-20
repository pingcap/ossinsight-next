import * as RuiAvatar from '@radix-ui/react-avatar';

export interface GHAvatarProps {
  name: string;
  size: number;
}

export function GHAvatar ({ name, size = 8 }: GHAvatarProps) {
  size = size || 8;

  return (
    <RuiAvatar.Root>
      <RuiAvatar.Fallback
        className="block rounded-full bg-gray-400"
        style={{
          width: `${size * 0.25}rem`,
          height: `${size * 0.25}rem`,
        }}
      />
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
