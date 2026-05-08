import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from './useAuthStore';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  phone?: string;
  createdAt: string;
}

interface UserState {
  users: ManagedUser[];
  addUser: (user: Omit<ManagedUser, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, data: Partial<Omit<ManagedUser, 'id' | 'createdAt'>>) => void;
  deleteUser: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [
        {
          id: "usr-1",
          name: "Admin Saqu",
          email: "admin@saqumart.com",
          role: "Owner",
          status: "Active",
          phone: "0812-3456-7890",
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        },
        {
          id: "usr-2",
          name: "Budi Kasir",
          email: "budi@saqumart.com",
          role: "Kasir",
          status: "Active",
          phone: "0813-9876-5432",
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        },
        {
          id: "usr-3",
          name: "Siti Inventory",
          email: "siti@saqumart.com",
          role: "Admin",
          status: "Inactive",
          phone: "0856-1234-5678",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
      ],
      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            { ...user, id: `usr-${Date.now()}`, createdAt: new Date().toISOString() },
          ],
        })),
      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
      toggleStatus: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
          ),
        })),
    }),
    {
      name: 'saqumart-users',
    }
  )
);
