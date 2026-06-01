import type { UserRole } from '../types';

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  profilePhoto: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface RepostMeta {
  id: string;
  by: UserPublic;
  createdAt: Date;
}

export interface FeedItem {
  kind: 'post' | 'repost';
  post: PostWithMeta;
  repost?: RepostMeta;
}

export interface PostWithMeta {
  id: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: UserPublic;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  likedByMe: boolean;
  repostedByMe: boolean;
}

export interface ConversationPreview {
  id: string;
  participant: UserPublic;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
  } | null;
  lastMessageAt: Date;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  sender: UserPublic;
}
