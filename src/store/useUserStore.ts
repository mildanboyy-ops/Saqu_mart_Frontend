import { create } from 'zustand';
import api from '@/lib/axios';
import type { UserRole } from './useAuthStore';

export interface ManagedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  phone?: string;
  createdAt: string;
}

interface UserState {
  users: ManagedUser[];
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<ManagedUser, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateUser: (id: string, data: Partial<ManagedUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  fetchUsers: async () => {
    try {
      const response = await api.get('/users');
      set({ users: response.data.data });
    } catch {
      console.error('Failed to fetch users');
    }
  },
  addUser: async (user) => {
    try {
      const response = await api.post('/users', user);
      set((state) => ({ users: [...state.users, response.data.data] }));
    } catch (error) {
      console.error('Failed to add user');
      throw error;
    }
  },
  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? response.data.data : u)),
      }));
    } catch (error) {
      console.error('Failed to update user');
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete user');
      throw error;
    }
  },
  toggleStatus: async (id) => {
    try {
      const response = await api.put(`/users/${id}/toggle-status`, {});
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? response.data.data : u)),
      }));
    } catch {
      console.error('Failed to toggle user status');
    }
  },
}));
