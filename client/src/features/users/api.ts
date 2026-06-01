import { api } from '../../shared/api/client';
import type { Pagination, ProfileResponse, User } from '../../shared/types/user';
import type { Post } from '../posts/types';

export async function fetchProfile(userId: string): Promise<ProfileResponse> {
  const res = await api.get<ProfileResponse>(`/api/users/${userId}`);
  return res.data;
}

export async function fetchUserPosts(
  userId: string,
  page = 1
): Promise<{ posts: Post[]; pagination: Pagination }> {
  const res = await api.get(`/api/users/${userId}/posts`, { params: { page, limit: 20 } });
  return res.data;
}

export async function updateProfile(data: {
  displayName?: string;
  bio?: string;
  profilePhoto?: string;
}): Promise<User> {
  const res = await api.patch<{ user: User }>('/api/users/me', data);
  return res.data.user;
}

export async function followUser(userId: string): Promise<void> {
  await api.post(`/api/users/${userId}/follow`);
}

export async function unfollowUser(userId: string): Promise<void> {
  await api.delete(`/api/users/${userId}/follow`);
}
