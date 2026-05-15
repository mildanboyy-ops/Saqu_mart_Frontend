import { create } from 'zustand';

interface Branch {
  id: string;
  name: string;
  address: string;
  status: 'online' | 'offline' | 'maintenance';
  todayRevenue: number;
  totalTransactions: number;
  employees: number;
  lat?: number;
  lng?: number;
}

interface BranchState {
  branches: Branch[];
  activeBranchId: string;
  setActiveBranch: (id: string) => void;
  updateBranchRevenue: (id: string, amount: number) => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  branches: [
    { id: 'b1', name: 'SaquMart Sawangan (HQ)', address: 'Bumi Sawangan Indah 2 Blok D2', status: 'online', todayRevenue: 2450000, totalTransactions: 47, employees: 5, lat: -6.396, lng: 106.776 },
    { id: 'b2', name: 'SaquMart Depok 2', address: 'Jl. Margonda Raya No. 100', status: 'online', todayRevenue: 1890000, totalTransactions: 35, employees: 3, lat: -6.386, lng: 106.831 },
    { id: 'b3', name: 'SaquMart Bogor', address: 'Jl. Pajajaran No. 55', status: 'offline', todayRevenue: 0, totalTransactions: 0, employees: 4, lat: -6.597, lng: 106.806 },
  ],
  activeBranchId: 'b1',
  setActiveBranch: (id) => set({ activeBranchId: id }),
  updateBranchRevenue: (id, amount) => set((state) => ({
    branches: state.branches.map(b => b.id === id ? { ...b, todayRevenue: b.todayRevenue + amount, totalTransactions: b.totalTransactions + 1 } : b)
  })),
}));
