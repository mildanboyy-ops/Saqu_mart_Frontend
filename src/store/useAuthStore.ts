import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

export type UserRole = 'Owner' | 'Admin' | 'Kasir';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  loginBiometric: (type: 'face' | 'fingerprint' | 'retina' | 'palm' | 'voice', data: any) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: async (credentials) => {
        try {
          const response = await api.post('/auth/login', credentials);
          const { user, accessToken } = response.data.data;
          set({ user, token: accessToken, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },
      loginBiometric: async (type, data) => {
        try {
          const response = await api.post(`/auth/login/${type}`, data);
          const { user, accessToken } = response.data.data;
          set({ user, token: accessToken, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },
      updateProfile: async (data: any) => {
        try {
          const user = get().user;
          if (!user) return;
          const response = await api.put(`/users/${user.id}`, data);
          set({ user: { ...user, ...response.data.data } });
        } catch (error) {
          console.error('Failed to update profile');
          throw error;
        }
      },
  logout: async () => {
        const token = get().token;
        set({ user: null, isAuthenticated: false, token: null });
        if (token) {
          try {
            await api.post('/auth/logout');
          } catch (e) {
            // Ignore error on logout
          }
        }
      },
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data.data, isAuthenticated: true });
        } catch (error) {
          set({ isAuthenticated: false, user: null, token: null });
        }
      },
    }),
    {
      name: 'saqumart-auth',
    }
  )
);
