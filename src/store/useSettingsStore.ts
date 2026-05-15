import { create } from 'zustand';
import api from '@/lib/axios';

interface SettingsState {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  taxRate: number;
  printerName: string;
  receiptFooter: string;
  isIslamicMode: boolean;
  autoSedekah: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<Omit<SettingsState, 'updateSettings' | 'fetchSettings'>>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  storeName: 'SAQU MART',
  storeAddress: '',
  storePhone: '',
  taxRate: 0,
  printerName: 'EPSON TM-T88V',
  receiptFooter: 'Terima kasih telah berbelanja!',
  isIslamicMode: false,
  autoSedekah: false,
  fetchSettings: async () => {
    try {
      const response = await api.get('/settings');
      set({ ...response.data.data });
    } catch {
      console.error('Failed to fetch settings');
    }
  },
  updateSettings: async (data) => {
    try {
      const response = await api.post('/settings', data);
      set({ ...response.data.data });
    } catch (error) {
      console.error('Failed to update settings');
      throw error;
    }
  },
}));
