import { create } from 'zustand';

interface UIState {
  dynamicIsland: {
    isOpen: boolean;
    title: string;
    description?: string;
    type: 'success' | 'warning' | 'error' | 'info';
  };
  showNotification: (title: string, description?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  hideNotification: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  dynamicIsland: {
    isOpen: false,
    title: '',
    type: 'info',
  },
  showNotification: (title, description, type = 'info') => {
    set({ dynamicIsland: { isOpen: true, title, description, type } });
    setTimeout(() => {
      set((state) => ({ dynamicIsland: { ...state.dynamicIsland, isOpen: false } }));
    }, 4000);
  },
  hideNotification: () => set((state) => ({ dynamicIsland: { ...state.dynamicIsland, isOpen: false } })),
}));
