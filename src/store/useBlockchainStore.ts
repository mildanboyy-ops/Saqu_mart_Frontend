import { create } from 'zustand';
import api from '@/lib/axios';

interface BlockchainTransaction {
  id: string;
  txHash: string;
  status: 'pending' | 'verified' | 'failed';
  amount: number;
  timestamp: string;
  blockNumber: number;
}

interface BlockchainState {
  transactions: BlockchainTransaction[];
  loyaltyPoints: number;
  walletAddress: string;
  isVerifying: boolean;
  networkStatus: string;
  fetchBlockchainData: () => Promise<void>;
  verifyTransaction: (txId: string, amount: number) => Promise<string>;
  addLoyaltyPoints: (points: number) => void;
  setVerifying: (status: boolean) => void;
}

export const useBlockchainStore = create<BlockchainState>((set) => ({
  transactions: [],
  loyaltyPoints: 0,
  walletAddress: '0x...',
  isVerifying: false,
  networkStatus: 'Unknown',
  fetchBlockchainData: async () => {
    try {
      const response = await api.get('/blockchain/status');
      const data = response.data.data || {};
      set({
        networkStatus: data.status || 'Operational',
        // Only set these if they exist in the response
        ...(data.transactions && { transactions: data.transactions }),
        ...(data.loyaltyPoints !== undefined && { loyaltyPoints: data.loyaltyPoints }),
        ...(data.walletAddress && { walletAddress: data.walletAddress }),
      });
    } catch {
      // Silently fail - blockchain is optional
    }
  },
  verifyTransaction: async (txId, amount) => {
    set({ isVerifying: true });
    try {
      const response = await api.post(`/blockchain/verify/${txId}`, { amount });
      const data = response.data.data || {};
      const txHash = data.txHash || `0x${Math.random().toString(16).slice(2, 10)}`;

      set((state) => ({
        transactions: [{
          id: txId,
          txHash,
          status: 'verified',
          amount,
          timestamp: new Date().toISOString(),
          blockNumber: data.blockNumber || 0,
        }, ...state.transactions],
        loyaltyPoints: data.newLoyaltyPoints || state.loyaltyPoints,
        isVerifying: false,
      }));
      return txHash;
    } catch (error) {
      set({ isVerifying: false });
      throw error;
    }
  },
  setVerifying: (status) => set({ isVerifying: status }),
  addLoyaltyPoints: (points) => set((state) => ({ loyaltyPoints: state.loyaltyPoints + points })),
}));
