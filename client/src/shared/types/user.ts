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
