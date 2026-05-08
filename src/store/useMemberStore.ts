import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Member {
  id: string;
  name: string;
  phone: string;
  balance: number;
}

interface MemberState {
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'balance'>) => void;
  updateBalance: (phone: string, amount: number) => void;
  getMemberByPhone: (phone: string) => Member | undefined;
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set, get) => ({
      members: [
        { id: '1', name: 'Pelanggan Umum', phone: '0000', balance: 0 }
      ],
      addMember: (member) => set((state) => ({
        members: [...state.members, { ...member, id: Date.now().toString(), balance: 0 }]
      })),
      updateBalance: (phone, amount) => set((state) => ({
        members: state.members.map((m) => 
          m.phone === phone ? { ...m, balance: m.balance + amount } : m
        )
      })),
      getMemberByPhone: (phone) => get().members.find((m) => m.phone === phone),
    }),
    {
      name: 'saqumart-members',
    }
  )
);
