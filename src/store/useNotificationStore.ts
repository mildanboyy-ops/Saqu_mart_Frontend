import { create } from 'zustand';
import api from '@/lib/axios';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai' | 'security' | 'islamic';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

interface NotificationState {
  notifications: Notification[];
  isOpen: boolean;
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  togglePanel: () => void;
  clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, _get) => ({
  notifications: [],
  isOpen: false,
  unreadCount: 0,
  fetchNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      const notifications = response.data.data || [];
      set({ 
        notifications,
        unreadCount: notifications.filter((n: any) => !n.read).length
      });
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  },
  addNotification: (n) => {
    const newNotif = { ...n, id: `n-${Date.now()}`, timestamp: new Date().toISOString(), read: false };
    set((state) => ({
      notifications: [newNotif, ...state.notifications].slice(0, 100),
      unreadCount: state.unreadCount + 1
    }));
  },
  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/mark-read`);
      set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  },
  markAllRead: async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read');
    }
  },
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  clearAll: async () => {
    try {
      await api.delete('/notifications');
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      console.error('Failed to clear notifications');
    }
  },
}));
