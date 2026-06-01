import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '../features/auth/api';
import { clearToken, getToken, setToken } from '../shared/api/client';
import type { User } from '../shared/types/user';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    displayName: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    const me = await authApi.fetchMe();
    setUser(me);
  }, []);

  useEffect(() => {
    refreshUser()
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (identifier: string, password: string) => {
    const { user: loggedIn, token } = await authApi.login(identifier, password);
    setToken(token);
    setUser(loggedIn);
  }, []);

  const register = useCallback(
    async (data: { username: string; email: string; password: string; displayName: string }) => {
      const { user: registered, token } = await authApi.register(data);
      setToken(token);
      setUser(registered);
    },
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshUser,
      isAuthenticated: !!user,
    }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
