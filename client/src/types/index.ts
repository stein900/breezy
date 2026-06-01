export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  profilePhoto: string | null;
  role: string;
  createdAt: string;
}

export interface PostAuthor {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  profilePhoto: string | null;
  role: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  likeCount: number;
  replyCount: number;
  likedByMe: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProfileStats {
  followerCount: number;
  followingCount: number;
  postCount: number;
}

export interface ProfileResponse {
  user: User;
  stats: ProfileStats;
  isFollowing: boolean;
  isOwnProfile: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
