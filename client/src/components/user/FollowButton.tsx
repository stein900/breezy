import { followUser, unfollowUser } from '../../features/users/api';
import { getErrorMessage } from '../../shared/api/client';
import { useEffect, useState } from 'react';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  isOwnProfile: boolean;
  onChange?: (following: boolean) => void;
}

export function FollowButton({
  userId,
  isFollowing: initial,
  isOwnProfile,
  onChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initial);
  }, [initial]);

  if (isOwnProfile) return null;

  const toggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        onChange?.(false);
      } else {
        await followUser(userId);
        setIsFollowing(true);
        onChange?.(true);
      }
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`min-w-[120px] px-4 py-1.5 text-[15px] font-bold disabled:opacity-50 ${
        isFollowing ? 'x-btn-following' : 'x-btn-follow'
      }`}
    >
      {loading ? '...' : isFollowing ? 'Abonné' : 'Suivre'}
    </button>
  );
}
