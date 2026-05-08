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
      storeAddress: 'Bumi Sawangan Indah 2 Blok D2 No 90, RT.005/RW.010, Pengasinan, Kec. Sawangan, Kota Depok, Jawa Barat 16518',
      storePhone: '0858-1754-1154',
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
