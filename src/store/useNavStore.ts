import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

interface NavState {
  recentItems: NavItem[];
  addItem: (item: NavItem) => void;
}

export const useNavStore = create<NavState>()(
  persist(
    (set, get) => ({
      recentItems: [],
      addItem: (item) => {
        const current = get().recentItems;
        const filtered = current.filter(i => i.path !== item.path);
        set({ recentItems: [item, ...filtered].slice(0, 4) });
      },
    }),
    { name: 'saqumart-nav' }
  )
);
