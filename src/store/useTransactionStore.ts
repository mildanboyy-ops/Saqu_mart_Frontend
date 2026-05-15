import { create } from 'zustand';
import api from '@/lib/axios';

export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  qty: number;
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  total: number;
  profit: number;
  payment: number;
  change: number;
  method: 'Cash' | 'Transfer' | 'Debit' | 'QRIS' | 'Hutang';
  sedekah?: number;
  memberId?: string;
  timestamp: string;
}

interface TransactionState {
  transactions: Transaction[];
  lastTransaction: Transaction | null;
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
  setLastTransaction: (tx: Transaction) => void;
  clearHistory: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  transactions: [],
  lastTransaction: null,
  isLoading: false,
  setLastTransaction: (tx) => set({ lastTransaction: tx }),
  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/pos/history');
      const data = response.data.data || [];
      const parsedData = data.map((tx: Transaction) => ({
        ...tx,
        total: Number(tx.total) || 0,
        profit: Number(tx.profit) || 0,
        payment: Number(tx.payment) || 0,
        change: Number(tx.change) || 0,
        sedekah: Number(tx.sedekah) || 0,
        items: tx.items ? tx.items.map((item: TransactionItem) => ({
           ...item,
           price: Number(item.price) || 0,
           costPrice: Number(item.costPrice) || 0,
           qty: Number(item.qty) || 0
        })) : []
      }));
      set({ transactions: parsedData });
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      set({ isLoading: false });
    }
  },
  addTransaction: async (tx) => {
    const response = await api.post('/pos/checkout', tx);
    const newTx = response.data.data;
    const parsedTx = {
      ...newTx,
      total: Number(newTx.total) || 0,
      profit: Number(newTx.profit) || 0,
      payment: Number(newTx.payment) || 0,
      change: Number(newTx.change) || 0,
      sedekah: Number(newTx.sedekah) || 0,
    };
    set({ transactions: [parsedTx, ...get().transactions] });
  },
  clearHistory: async () => {
    await api.delete('/pos/history');
    set({ transactions: [] });
  },
}));
