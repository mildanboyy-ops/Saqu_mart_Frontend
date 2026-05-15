import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  xp: number;
  level: number;
  streak: number;
  totalTransactions: number;
  totalRevenue: number;
  avatar?: string;
}

interface GamificationState {
  employees: Employee[];
  dailyMissions: Mission[];
  fetchMissions: () => Promise<void>;
  fetchEmployees: () => Promise<void>;
  updateEmployeeXP: (id: string, xp: number) => Promise<void>;
  completeMission: (id: string) => Promise<void>;
  recordTransaction: (amount: number) => Promise<void>;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      employees: [],
      dailyMissions: [],
      fetchMissions: async () => {
        try {
          const response = await api.get('/gamification/missions');
          set({ dailyMissions: response.data.data || [] });
        } catch {
          // Silently fail - gamification is optional
        }
      },
      fetchEmployees: async () => {
        try {
          const response = await api.get('/gamification/rankings');
          set({ employees: response.data.data || [] });
        } catch {
          // Silently fail - gamification is optional
        }
      },
      updateEmployeeXP: async (id, xp) => {
        try {
          await api.patch(`/gamification/xp/${id}`, { xp });
          get().fetchEmployees();
        } catch {
          console.error('Failed to update XP');
        }
      },
      completeMission: async (id) => {
        try {
          await api.post(`/gamification/missions/${id}/complete`);
          get().fetchMissions();
        } catch {
          console.error('Failed to complete mission');
        }
      },
      recordTransaction: async (amount: number) => {
        // Local simulation for demo
        set((state) => ({
          dailyMissions: state.dailyMissions.map(m => {
            if (m.title.toLowerCase().includes('transaksi') && !m.completed) {
              const newProgress = m.progress + 1;
              return { ...m, progress: newProgress, completed: newProgress >= m.target };
            }
            return m;
          }),
          employees: state.employees.map(e => {
            // Assume first employee is the current user for demo
            const isSelf = true; 
            if (isSelf) {
              const newXp = e.xp + Math.floor(amount / 10000);
              const newLevel = Math.floor(newXp / 500) + 1;
              return { 
                ...e, 
                xp: newXp, 
                level: newLevel,
                totalTransactions: e.totalTransactions + 1,
                totalRevenue: e.totalRevenue + amount
              };
            }
            return e;
          })
        }));
      }
    }),
    { name: 'saqumart-gamification' }
  )
);
