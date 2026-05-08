import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Omit<Product, 'id'>>) => void;
  updateStock: (barcode: string, amount: number) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [
        { id: "1", barcode: "89999990001", name: "Indomie Goreng", category: "Makanan", stock: 150, price: 3500, costPrice: 2800 },
        { id: "2", barcode: "89999990002", name: "Aqua Botol 600ml", category: "Minuman", stock: 48, price: 3000, costPrice: 1500 },
        { id: "3", barcode: "89999990003", name: "Roti Tawar Sari", category: "Makanan", stock: 12, price: 15000, costPrice: 12000 },
        { id: "4", barcode: "89999990004", name: "Susu UHT Ultra 250ml", category: "Minuman", stock: 24, price: 6500, costPrice: 5200 },
        { id: "5", barcode: "89999990005", name: "Beras Maknyus 5kg", category: "Sembako", stock: 15, price: 68000, costPrice: 62000 },
        { id: "6", barcode: "89999990006", name: "Minyak Bimoli 2L", category: "Sembako", stock: 10, price: 38000, costPrice: 34000 },
        { id: "7", barcode: "89999990007", name: "Gula Pasir 1kg", category: "Sembako", stock: 30, price: 16000, costPrice: 14500 },
        { id: "8", barcode: "89999990008", name: "Telur Ayam 1kg", category: "Sembako", stock: 50, price: 28000, costPrice: 24000 },
        { id: "9", barcode: "89999990009", name: "Teh Botol Sosro", category: "Minuman", stock: 20, price: 5000, costPrice: 3800 },
        { id: "10", barcode: "89999990010", name: "Pringles Original", category: "Makanan", stock: 8, price: 22000, costPrice: 18000 },
      ],
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: Date.now().toString() }]
      })),
      updateProduct: (id, data) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      updateStock: (barcode, amount) => set((state) => ({
        products: state.products.map(p => 
          p.barcode === barcode ? { ...p, stock: p.stock + amount } : p
        )
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
    }),
    {
      name: 'saqumart-products',
    }
  )
);
