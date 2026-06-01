import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  BarChart2,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share,
} from 'lucide-react';
import { likePost, unlikePost, repostPost, undoRepost } from '../api';
import { getErrorMessage } from '../../../shared/api/client';
import type { FeedItem, Post } from '../types';
import { formatCount, formatRelativeTime } from '../../../shared/utils/format';
import { Avatar } from '../../../components/ui/Avatar';
import { RepostBanner } from './RepostBanner';

interface PostCardProps {
  post: Post;
  repost?: FeedItem['repost'];
  onUpdate?: (post: Post) => void;
  compact?: boolean;
  showActions?: boolean;
  clickable?: boolean;
}

export function PostCard({
  post,
  repost,
  onUpdate,
  compact,
  showActions = true,
  clickable = true,
}: PostCardProps) {
  const navigate = useNavigate();
  const [local, setLocal] = useState(post);
  const [liking, setLiking] = useState(false);
  const [reposting, setReposting] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    try {
      if (local.likedByMe) {
        await unlikePost(local.id);
        const updated = { ...local, likedByMe: false, likeCount: Math.max(0, local.likeCount - 1) };
        setLocal(updated);
        onUpdate?.(updated);
      } else {
        await likePost(local.id);
        const updated = { ...local, likedByMe: true, likeCount: local.likeCount + 1 };
        setLocal(updated);
        onUpdate?.(updated);
      }
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLiking(false);
    }
  };

  const toggleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reposting) return;
    setReposting(true);
    try {
      if (local.repostedByMe) {
        await undoRepost(local.id);
        const updated = {
          ...local,
          repostedByMe: false,
          repostCount: Math.max(0, local.repostCount - 1),
        };
        setLocal(updated);
        onUpdate?.(updated);
      } else {
        await repostPost(local.id);
        const updated = {
          ...local,
          repostedByMe: true,
          repostCount: local.repostCount + 1,
        };
        setLocal(updated);
        onUpdate?.(updated);
      }
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setReposting(false);
    }
  };

  return (
    <article
      role={clickable ? 'link' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={clickable ? () => navigate(`/post/${local.id}`) : undefined}
      onKeyDown={
        clickable ? (e) => e.key === 'Enter' && navigate(`/post/${local.id}`) : undefined
      }
      className={`relative x-divider ${clickable ? 'cursor-pointer x-hover-row' : ''} ${compact ? 'px-4 py-2.5' : 'px-4 py-3'}`}
    >
      {repost && <RepostBanner repost={repost} />}

      {hovered && clickable && (
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-3 top-3 flex h-[34px] w-[34px] items-center justify-center rounded-full text-x-blue transition-colors hover:bg-x-blue/10"
        >
          <MoreHorizontal className="h-[18px] w-[18px]" />
        </button>
      )}

      <div className="flex gap-3">
        <Link
          to={`/user/${local.author.id}`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        >
          <Avatar user={local.author} size={compact ? 'sm' : 'md'} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1 text-x-body">
            <Link
              to={`/user/${local.author.id}`}
              onClick={(e) => e.stopPropagation()}
              className="truncate font-bold hover:underline"
            >
              {local.author.displayName}
            </Link>
            <span className="truncate text-x-gray">@{local.author.username}</span>
            <span className="text-x-gray">·</span>
            <time className="text-x-gray hover:underline" dateTime={local.createdAt}>
              {formatRelativeTime(local.createdAt)}
            </time>
          </div>

          <p className="mt-0.5 whitespace-pre-wrap break-words text-x-body leading-5">
            {local.content}
          </p>

          {showActions && (
            <div className="-ml-2 mt-3 flex max-w-[425px] justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post/${local.id}`);
                }}
                className="group flex items-center gap-0.5 text-x-gray transition-colors"
              >
                <span className="x-action-icon group-hover:bg-x-blue/10 group-hover:text-x-blue">
                  <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                {local.replyCount > 0 && (
                  <span className="min-w-[1ch] text-[13px] leading-4">{formatCount(local.replyCount)}</span>
                )}
              </button>

              <button
                type="button"
                onClick={toggleRepost}
                disabled={reposting}
                className={`group flex items-center gap-0.5 transition-colors ${
                  local.repostedByMe ? 'text-x-green' : 'text-x-gray'
                }`}
              >
                <span
                  className={`x-action-icon ${
                    local.repostedByMe
                      ? 'bg-x-green/10'
                      : 'group-hover:bg-x-green/10 group-hover:text-x-green'
                  }`}
                >
                  <Repeat2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                {local.repostCount > 0 && (
                  <span className="min-w-[1ch] text-[13px] leading-4">{formatCount(local.repostCount)}</span>
                )}
              </button>

              <button
                type="button"
                onClick={toggleLike}
                disabled={liking}
                className={`group flex items-center gap-0.5 transition-colors ${
                  local.likedByMe ? 'text-x-pink' : 'text-x-gray'
                }`}
              >
                <span
                  className={`x-action-icon ${
                    local.likedByMe
                      ? 'bg-x-pink/10'
                      : 'group-hover:bg-x-pink/10 group-hover:text-x-pink'
                  }`}
                >
                  <Heart
                    className={`h-[18px] w-[18px] ${local.likedByMe ? 'fill-x-pink' : ''}`}
                    strokeWidth={1.75}
                  />
                </span>
                {local.likeCount > 0 && (
                  <span className="min-w-[1ch] text-[13px] leading-4">{formatCount(local.likeCount)}</span>
                )}
              </button>

              <button type="button" onClick={(e) => e.stopPropagation()} className="group flex text-x-gray">
                <span className="x-action-icon group-hover:bg-x-blue/10 group-hover:text-x-blue">
                  <BarChart2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
              </button>

              <div className="flex gap-0">
                <button type="button" onClick={(e) => e.stopPropagation()} className="group flex text-x-gray">
                  <span className="x-action-icon group-hover:bg-x-blue/10 group-hover:text-x-blue">
                    <Bookmark className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>
                </button>
                <button type="button" onClick={(e) => e.stopPropagation()} className="group flex text-x-gray">
                  <span className="x-action-icon group-hover:bg-x-blue/10 group-hover:text-x-blue">
                    <Share className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function FeedItemCard({
  item,
  onUpdate,
}: {
  item: FeedItem;
  onUpdate?: (post: Post) => void;
}) {
  return (
    <PostCard
      post={item.post}
      repost={item.kind === 'repost' ? item.repost : undefined}
      onUpdate={onUpdate}
    />
  );
}
