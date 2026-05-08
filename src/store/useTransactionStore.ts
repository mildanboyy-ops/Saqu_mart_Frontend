import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  method: 'Cash' | 'Non-Cash';
  timestamp: string;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [
        {
          id: "TX-1715070000000",
          items: [{ id: "1", name: "Indomie Goreng", price: 3500, costPrice: 2800, qty: 5 }],
          total: 17500,
          profit: 3500,
          payment: 20000,
          change: 2500,
          method: "Cash",
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: "TX-1715080000000",
          items: [{ id: "5", name: "Beras Maknyus 5kg", price: 68000, costPrice: 62000, qty: 1 }],
          total: 68000,
          profit: 6000,
          payment: 68000,
          change: 0,
          method: "Non-Cash",
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "TX-1715090000000",
          items: [
            { id: "2", name: "Aqua Botol 600ml", price: 3000, costPrice: 1500, qty: 2 },
            { id: "4", name: "Susu UHT Ultra", price: 6500, costPrice: 5200, qty: 3 }
          ],
          total: 25500,
          profit: 6900,
          payment: 30000,
          change: 4500,
          method: "Cash",
          timestamp: new Date().toISOString()
        }
      ],
      addTransaction: (tx) => set((state) => ({
        transactions: [
          { 
            ...tx, 
            id: `TX-${Date.now()}`, 
            timestamp: new Date().toISOString() 
          }, 
          ...state.transactions
        ]
      })),
      clearHistory: () => set({ transactions: [] }),
    }),
    {
      name: 'saqumart-transactions',
    }
  )
);
