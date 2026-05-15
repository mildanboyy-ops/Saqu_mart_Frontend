import { create } from 'zustand';

import type { Product } from './useProductStore';

export interface CartItem extends Product {
  qty: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>((set) => ({
  cart: [],
  total: 0,
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(i => i.id === product.id);
    let newCart;
    if (existing) {
      newCart = state.cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
    } else {
      newCart = [...state.cart, { ...product, qty: 1 }];
    }
    const total = newCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return { cart: newCart, total };
  }),
  removeFromCart: (id) => set((state) => {
    const newCart = state.cart.filter(i => i.id !== id);
    const total = newCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return { cart: newCart, total };
  }),
  updateQty: (id, qty) => set((state) => {
    const newCart = state.cart.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i);
    const total = newCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return { cart: newCart, total };
  }),
  clearCart: () => set({ cart: [], total: 0 }),
}));
