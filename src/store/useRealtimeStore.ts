import { create } from 'zustand';

interface RealtimeEvent {
  id: string;
  type: 'transaction' | 'stock' | 'member' | 'alert' | 'sync' | 'device';
  message: string;
  timestamp: string;
  branch?: string;
  amount?: number;
}

interface RealtimeState {
  isConnected: boolean;
  events: RealtimeEvent[];
  liveOmzet: number;
  onlineUsers: number;
  syncStatus: 'synced' | 'syncing' | 'error' | 'offline';
  lastEvent: RealtimeEvent | null;
  addEvent: (event: Omit<RealtimeEvent, 'id' | 'timestamp'>) => void;
  setConnected: (status: boolean) => void;
  setLiveOmzet: (amount: number) => void;
  setSyncStatus: (status: RealtimeState['syncStatus']) => void;
  setOnlineUsers: (count: number) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  isConnected: true,
  events: [
    { id: 'e1', type: 'transaction', message: 'Sistem SaquMart Aktif', timestamp: new Date().toISOString(), branch: 'Sistem' },
  ],
  liveOmzet: 0,
  onlineUsers: 1,
  syncStatus: 'synced',
  lastEvent: null,
  addEvent: (event) => set((state) => {
    const newEvent = { ...event, id: `e-${Date.now()}`, timestamp: new Date().toISOString() };
    return {
      events: [newEvent, ...state.events].slice(0, 50),
      lastEvent: newEvent,
      onlineUsers: Math.max(1, state.onlineUsers + (Math.random() > 0.8 ? 1 : Math.random() > 0.8 ? -1 : 0))
    };
  }),
  setConnected: (status) => set({ isConnected: status }),
  setLiveOmzet: (amount) => set({ liveOmzet: amount }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setOnlineUsers: (count) => set({ onlineUsers: count }),
}));
