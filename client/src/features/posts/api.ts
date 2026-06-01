import { api } from '../../shared/api/client';
import type { Pagination } from '../../shared/types/user';
import type { FeedItem, Post } from './types';

export async function fetchFeed(page = 1): Promise<{ items: FeedItem[]; pagination: Pagination }> {
  const res = await api.get('/api/posts/feed', { params: { page, limit: 20 } });
  return res.data;
}

export async function createPost(content: string): Promise<Post> {
  const res = await api.post<{ post: Post }>('/api/posts', { content });
  return res.data.post;
}

export async function fetchPost(postId: string): Promise<Post> {
  const res = await api.get<{ post: Post }>(`/api/posts/${postId}`);
  return res.data.post;
}

export async function likePost(postId: string): Promise<void> {
  await api.post(`/api/posts/${postId}/like`);
}

export async function unlikePost(postId: string): Promise<void> {
  await api.delete(`/api/posts/${postId}/like`);
}

export async function repostPost(postId: string): Promise<void> {
  await api.post(`/api/posts/${postId}/repost`);
}

export async function undoRepost(postId: string): Promise<void> {
  await api.delete(`/api/posts/${postId}/repost`);
}

export async function fetchComments(
  postId: string,
  page = 1
): Promise<{ comments: Post[]; pagination: Pagination }> {
  const res = await api.get(`/api/posts/${postId}/comments`, { params: { page, limit: 20 } });
  return res.data;
}

export async function createComment(postId: string, content: string): Promise<Post> {
  const res = await api.post<{ comment: Post }>(`/api/posts/${postId}/comments`, { content });
  return res.data.comment;
}

export async function createReply(commentId: string, content: string): Promise<Post> {
  const res = await api.post<{ reply: Post }>(
    `/api/posts/comments/${commentId}/replies`,
    { content }
  );
  return res.data.reply;
}

export async function fetchReplies(
  commentId: string
): Promise<{ replies: Post[]; pagination: Pagination }> {
  const res = await api.get(`/api/posts/comments/${commentId}/replies`);
  return res.data;
}

export async function deletePost(postId: string): Promise<void> {
  await api.delete(`/api/posts/${postId}`);
}
