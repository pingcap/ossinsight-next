import './style.scss';

export interface AvatarSkeletonProps {
  size?: number
}

export function AvatarSkeleton ({ size = 8 }: AvatarSkeletonProps) {
  return (
    <span
      className='block rounded-full skeleton'
      style={{
        width: `${size * 0.25}rem`,
        height: `${size * 0.25}rem`,
      }}
    />
  )
}
