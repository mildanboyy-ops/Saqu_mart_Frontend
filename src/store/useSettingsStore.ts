import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  taxRate: number;
  printerName: string;
  receiptFooter: string;
  updateSettings: (data: Partial<Omit<SettingsState, 'updateSettings'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      storeName: 'SAQU MART (Sahabat Quran Mart)',
      storeAddress: 'Jl. Pesantren No. 123, Kota Bandung',
      storePhone: '0812-3456-7890',
      taxRate: 0,
      printerName: 'EPSON TM-T88V',
      receiptFooter: 'Terima kasih telah berbelanja!',
      updateSettings: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'saqumart-settings',
    }
  )
);
