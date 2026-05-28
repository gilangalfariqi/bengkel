import { create } from "zustand";
import type { CartLine } from "@/domain/entities/cart";

type CartState = {
  items: CartLine[];
  isHydrated: boolean;
  hydrate: () => void;
  addItem: (productId: number, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "bengkel_cart";

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isHydrated: false,
  hydrate: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        set({ items: [], isHydrated: true });
        return;
      }
      const parsed = JSON.parse(raw) as CartLine[];
      set({ items: parsed, isHydrated: true });
    } catch {
      set({ items: [], isHydrated: true });
    }
  },
  addItem: (productId, qty = 1) => {
    const existing = get().items.find((i) => i.productId === productId);
    let next: CartLine[];
    if (existing) {
      next = get().items.map((i) =>
        i.productId === productId ? { ...i, qty: i.qty + qty } : i
      );
    } else {
      next = [...get().items, { productId, qty }];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ items: next });
  },
  setQty: (productId, qty) => {
    const next = qty <= 0
      ? get().items.filter((i) => i.productId !== productId)
      : get().items.map((i) => (i.productId === productId ? { ...i, qty } : i));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ items: next });
  },
  removeItem: (productId) => {
    const next = get().items.filter((i) => i.productId !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ items: next });
  },
  clearCart: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ items: [] });
  },
}));
