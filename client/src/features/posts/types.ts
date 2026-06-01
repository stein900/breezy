import type { User } from '../../shared/types/user';

export interface Post {
  id: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  author: User;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  likedByMe: boolean;
  repostedByMe: boolean;
}

export interface RepostMeta {
  id: string;
  by: User;
  createdAt: string;
}

export interface FeedItem {
  kind: 'post' | 'repost';
  post: Post;
  repost?: RepostMeta;
}
