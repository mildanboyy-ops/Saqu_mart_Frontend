import { create } from 'zustand';
import api from '@/lib/axios';

export interface Member {
  id: string;
  name: string;
  phone: string;
  balance: number;
  debt: number;
  debtLimit: number;
  transactionCount: number;
}

interface MemberState {
  members: Member[];
  isLoading: boolean;
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<Member, 'id' | 'balance'>) => Promise<void>;
  updateMember: (id: string, data: Partial<Omit<Member, 'id'>>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  updateBalance: (phone: string, amount: number) => Promise<void>;
  payDebt: (phone: string, amount: number) => Promise<void>;
  getMemberByPhone: (phone: string) => Member | undefined;
}

export const useMemberStore = create<MemberState>()((set, get) => ({
  members: [],
  isLoading: false,
  fetchMembers: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/users?role=Member');
      const data = response.data.data || [];
      // Map backend data to Member interface
      const members: Member[] = data.map((m: any) => ({
        id: m.id,
        name: m.name || '',
        phone: m.phone || m.username || '',
        balance: m.points || 0,
        debt: m.debt || 0,
        debtLimit: m.debtLimit || 500000,
        transactionCount: m.transactionCount || 0,
      }));
      set({ members });
    } catch {
      // Silently fail - members list starts empty
    } finally {
      set({ isLoading: false });
    }
  },
  addMember: async (member) => {
    try {
      const response = await api.post('/users', { ...member, role: 'Member' });
      const m = response.data.data;
      set({ members: [...get().members, { id: m.id, name: m.name, phone: m.phone || '', balance: 0, debt: 0, debtLimit: 500000, transactionCount: 0 }] });
    } catch (error) {
      throw error;
    }
  },
  updateMember: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      const m = response.data.data;
      set({
        members: get().members.map((mem) => (mem.id === id ? { ...mem, ...data, name: m.name || mem.name, phone: m.phone || mem.phone } : mem)),
      });
    } catch (error) {
      throw error;
    }
  },
  deleteMember: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      set({ members: get().members.filter((m) => m.id !== id) });
    } catch (error) {
      throw error;
    }
  },
  updateBalance: async (phone, amount) => {
    try {
      const member = get().getMemberByPhone(phone);
      if (member) {
        await get().updateMember(member.id, { balance: member.balance + amount } as any);
      }
    } catch (error) {
      throw error;
    }
  },
  payDebt: async (phone, amount) => {
    try {
      const member = get().getMemberByPhone(phone);
      if (member) {
        const newDebt = Math.max(0, member.debt - amount);
        await get().updateMember(member.id, { debt: newDebt } as any);
      }
    } catch (error) {
      throw error;
    }
  },
  getMemberByPhone: (phone) => get().members.find((m) => m.phone === phone),
}));
