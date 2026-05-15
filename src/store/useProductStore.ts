import { create } from 'zustand';
import api from '@/lib/axios';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number; // Harga Jual
  costPrice: number; // Harga Beli
  stock: number;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => Promise<void>;
  updateStock: (barcode: string, amount: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/products');
      const parsedData = (response.data.data || []).map((p: any) => ({
        ...p,
        price: Number(p.price) || 0,
        costPrice: Number(p.costPrice) || 0,
        stock: Number(p.stock) || 0
      }));
      set({ products: parsedData });
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      set({ isLoading: false });
    }
  },
  addProduct: async (product) => {
    try {
      const response = await api.post('/products', product);
      const p = response.data.data;
      const parsedProduct = {
        ...p,
        price: Number(p.price) || 0,
        costPrice: Number(p.costPrice) || 0,
        stock: Number(p.stock) || 0
      };
      set({ products: [...get().products, parsedProduct] });
    } catch (error) {
      throw error;
    }
  },
  updateProduct: async (id, data) => {
    try {
      const response = await api.put(`/products/${id}`, data);
      const p = response.data.data;
      const parsedProduct = {
        ...p,
        price: Number(p.price) || 0,
        costPrice: Number(p.costPrice) || 0,
        stock: Number(p.stock) || 0
      };
      set({
        products: get().products.map((prod) => (prod.id === id ? parsedProduct : prod)),
      });
    } catch (error) {
      throw error;
    }
  },
  updateStock: async (barcode, amount) => {
    try {
      const product = get().products.find(p => p.barcode === barcode);
      if (product) {
        const response = await api.patch(`/products/${product.id}/stock`, {
          quantity: Math.abs(amount),
          type: amount > 0 ? 'IN' : 'OUT',
          note: 'Stock update from store'
        });
        const p = response.data.data;
        const parsedProduct = {
          ...p,
          price: Number(p.price) || 0,
          costPrice: Number(p.costPrice) || 0,
          stock: Number(p.stock) || 0
        };
        set({
          products: get().products.map((prod) => (prod.id === product.id ? parsedProduct : prod)),
        });
      }
    } catch (error) {
      throw error;
    }
  },
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      set({ products: get().products.filter((p) => p.id !== id) });
    } catch (error) {
      throw error;
    }
  },
}));
