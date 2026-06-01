import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Link2, Mail, MapPin } from 'lucide-react';
import { fetchProfile, fetchUserPosts } from '../features/users/api';
import { openConversation } from '../features/messages/api';
import { getErrorMessage } from '../shared/api/client';
import type { Post } from '../features/posts/types';
import type { ProfileResponse } from '../shared/types/user';
import { formatDate } from '../shared/utils/format';
import { ProfileHeader } from '../components/layout/AppLayout';
import { Avatar } from '../components/ui/Avatar';
import { FollowButton } from '../components/user/FollowButton';
import { PostCard } from '../features/posts/components/PostCard';

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openingChat, setOpeningChat] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileData, postsData] = await Promise.all([
          fetchProfile(userId),
          fetchUserPosts(userId),
        ]);
        setProfile(profileData);
        setPosts(postsData.posts);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const startMessage = async () => {
    if (!userId) return;
    setOpeningChat(true);
    try {
      const conversationId = await openConversation(userId);
      navigate(`/messages/${conversationId}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setOpeningChat(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-x-blue border-t-transparent" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-x-pink">{error || 'Profil introuvable'}</p>
        <Link to="/" className="mt-4 inline-block text-x-blue hover:underline">
          Retour
        </Link>
      </div>
    );
  }

  const { user, stats, isFollowing, isOwnProfile } = profile;

  return (
    <>
      <ProfileHeader title={user.displayName} postCount={stats.postCount} />

      <div className="relative h-[200px] bg-x-banner" />

      <div className="px-4 pb-4">
        <div className="-mt-[67px] flex items-end justify-between gap-2">
          <Avatar user={user} size="xl" ring />
          <div className="flex flex-wrap justify-end gap-2 pb-3">
            {!isOwnProfile && (
              <button
                type="button"
                onClick={startMessage}
                disabled={openingChat}
                className="x-btn-following inline-flex items-center gap-2 px-4 py-1.5 text-[15px] font-bold disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
                Message
              </button>
            )}
            {isOwnProfile ? (
              <Link
                to="/settings"
                className="x-btn-following inline-block px-4 py-1.5 text-[15px] font-bold"
              >
                Modifier le profil
              </Link>
            ) : (
              <FollowButton
                userId={user.id}
                isFollowing={isFollowing}
                isOwnProfile={isOwnProfile}
                onChange={(following) =>
                  setProfile((p) =>
                    p
                      ? {
                          ...p,
                          isFollowing: following,
                          stats: {
                            ...p.stats,
                            followerCount: p.stats.followerCount + (following ? 1 : -1),
                          },
                        }
                      : p
                  )
                }
              />
            )}
          </div>
        </div>

        <div className="mt-3">
          <h2 className="text-x-title leading-6">{user.displayName}</h2>
          <p className="text-[15px] leading-5 text-x-gray">@{user.username}</p>
          {user.bio && (
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-5">{user.bio}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-x-gray">
            <span className="flex items-center gap-1">
              <MapPin className="h-[18px] w-[18px]" />
              France
            </span>
            <span className="flex items-center gap-1">
              <Link2 className="h-[18px] w-[18px]" />
              breezy.app
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-[18px] w-[18px]" />
              A rejoint {formatDate(user.createdAt)}
            </span>
          </div>

          <div className="mt-3 flex gap-5 text-[15px]">
            <button type="button" className="hover:underline">
              <span className="font-bold text-x-white">{stats.followingCount}</span>{' '}
              <span className="text-x-gray">Abonnements</span>
            </button>
            <button type="button" className="hover:underline">
              <span className="font-bold text-x-white">{stats.followerCount}</span>{' '}
              <span className="text-x-gray">Abonnés</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex border-b border-x-border">
        <button type="button" className="x-tab x-tab-active flex-1">
          Posts
        </button>
        <button type="button" className="x-tab flex-1 opacity-50" disabled>
          Réponses
        </button>
        <button type="button" className="x-tab flex-1 opacity-50" disabled>
          Reposts
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="text-[31px] font-extrabold leading-9">
            {isOwnProfile ? "Vous n'avez pas encore posté" : 'Aucun post'}
          </p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </>
  );
}
