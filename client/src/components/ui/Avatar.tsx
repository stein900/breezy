import { User } from 'lucide-react';

interface AvatarProps {
  user: { displayName: string; profilePhoto: string | null };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
}

const sizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-10 w-10 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-[134px] w-[134px] text-4xl',
};

const rings = {
  xs: 'ring-2',
  sm: 'ring-2',
  md: 'ring-2',
  lg: 'ring-2',
  xl: 'ring-4',
};

export function Avatar({ user, size = 'md', ring }: AvatarProps) {
  const initials = user.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const ringClass = ring ? `${rings[size]} ring-x-black` : '';

  if (user.profilePhoto) {
    return (
      <img
        src={user.profilePhoto}
        alt={user.displayName}
        className={`${sizes[size]} ${ringClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} ${ringClass} flex shrink-0 items-center justify-center rounded-full bg-[#333639] font-bold text-x-white`}
    >
      {initials || <User className="h-1/2 w-1/2 text-x-gray" />}
    </div>
  );
}
