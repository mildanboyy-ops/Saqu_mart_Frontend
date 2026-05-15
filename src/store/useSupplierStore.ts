import { create } from 'zustand';
import api from '@/lib/axios';

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
  category: string;
}

interface SupplierState {
  suppliers: Supplier[];
  fetchSuppliers: () => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
}

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: [],
  fetchSuppliers: async () => {
    try {
      const response = await api.get('/suppliers');
      set({ suppliers: response.data.data });
    } catch {
      console.error('Failed to fetch suppliers');
    }
  },
  addSupplier: async (supplier) => {
    try {
      const response = await api.post('/suppliers', supplier);
      set((state) => ({ suppliers: [...state.suppliers, response.data.data] }));
    } catch (error) {
      console.error('Failed to add supplier');
      throw error;
    }
  },
  updateSupplier: async (id, data) => {
    try {
      const response = await api.put(`/suppliers/${id}`, data);
      set((state) => ({
        suppliers: state.suppliers.map((s) => s.id === id ? response.data.data : s),
      }));
    } catch (error) {
      console.error('Failed to update supplier');
      throw error;
    }
  },
  deleteSupplier: async (id) => {
    try {
      await api.delete(`/suppliers/${id}`);
      set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete supplier');
      throw error;
    }
  },
}));
