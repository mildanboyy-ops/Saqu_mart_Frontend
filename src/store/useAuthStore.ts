import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'Owner' | 'Admin' | 'Kasir';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: (user) => set({ user, isAuthenticated: true, token: user.token || `local-${Date.now()}` }),
      logout: () => set({ user: null, isAuthenticated: false, token: null }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'saqumart-auth',
    }
  )
);
