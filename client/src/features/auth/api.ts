import { api, clearToken, getToken, setToken } from '../../shared/api/client';
import type { AuthResponse, User } from '../../shared/types/user';

export { getToken, setToken, clearToken };

export async function register(data: {
  username: string;
  email: string;
  password: string;
  displayName: string;
}): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/auth/register', data);
  return res.data;
}

export async function login(login: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/auth/login', { login, password });
  return res.data;
}

export async function fetchMe(): Promise<User> {
  const res = await api.get<{ user: User }>('/api/auth/me');
  return res.data.user;
}
