import { create } from "zustand";

type WishlistState = {
  productIds: number[];
  isHydrated: boolean;
  hydrate: () => void;
  toggle: (productId: number) => void;
  add: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "bengkel_wishlist";

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: [],
  isHydrated: false,
  hydrate: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        set({ productIds: [], isHydrated: true });
        return;
      }
      const parsed = JSON.parse(raw) as number[];
      set({ productIds: parsed, isHydrated: true });
    } catch {
      set({ productIds: [], isHydrated: true });
    }
  },
  toggle: (productId) => {
    const has = get().productIds.includes(productId);
    const next = has
      ? get().productIds.filter((id) => id !== productId)
      : [...get().productIds, productId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ productIds: next });
  },
  add: (productId) => {
    const next = get().productIds.includes(productId)
      ? get().productIds
      : [...get().productIds, productId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ productIds: next });
  },
  remove: (productId) => {
    const next = get().productIds.filter((id) => id !== productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ productIds: next });
  },
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ productIds: [] });
  },
}));

