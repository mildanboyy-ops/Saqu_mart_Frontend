import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PrayerTime {
  name: string;
  time: string;
  nameAr: string;
}

interface IslamicState {
  isRamadanMode: boolean;
  isAdzanActive: boolean;
  currentPrayer: string;
  prayerTimes: PrayerTime[];
  totalSedekah: number;
  sedekahHistory: { amount: number; date: string }[];
  greeting: string;
  toggleRamadanMode: () => void;
  triggerAdzan: (prayer: string) => void;
  dismissAdzan: () => void;
  addSedekah: (amount: number) => void;
  updateGreeting: () => void;
}

export const useIslamicStore = create<IslamicState>()(
  persist(
    (set) => ({
      isRamadanMode: false,
      isAdzanActive: false,
      currentPrayer: '',
      prayerTimes: [
        { name: 'Subuh', time: '04:32', nameAr: 'الفجر' },
        { name: 'Dzuhur', time: '11:52', nameAr: 'الظهر' },
        { name: 'Ashar', time: '15:12', nameAr: 'العصر' },
        { name: 'Maghrib', time: '17:52', nameAr: 'المغرب' },
        { name: 'Isya', time: '19:05', nameAr: 'العشاء' },
      ],
      totalSedekah: 15000,
      sedekahHistory: [
        { amount: 500, date: new Date().toISOString() },
        { amount: 1000, date: new Date(Date.now() - 86400000).toISOString() },
      ],
      greeting: 'Assalamu\'alaikum',
      toggleRamadanMode: () => set((state) => ({ isRamadanMode: !state.isRamadanMode })),
      triggerAdzan: (prayer) => set({ isAdzanActive: true, currentPrayer: prayer }),
      dismissAdzan: () => set({ isAdzanActive: false }),
      addSedekah: (amount) => set((state) => ({
        totalSedekah: state.totalSedekah + amount,
        sedekahHistory: [{ amount, date: new Date().toISOString() }, ...state.sedekahHistory],
      })),
      updateGreeting: () => {
        const hour = new Date().getHours();
        let greeting = 'Assalamu\'alaikum';
        if (hour >= 3 && hour < 10) greeting = 'Selamat Pagi, Assalamu\'alaikum';
        else if (hour >= 10 && hour < 15) greeting = 'Selamat Siang, Assalamu\'alaikum';
        else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore, Assalamu\'alaikum';
        else greeting = 'Selamat Malam, Assalamu\'alaikum';
        set({ greeting });
      },
    }),
    { name: 'saqumart-islamic' }
  )
);
