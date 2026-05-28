import { create } from "zustand";
import { productService } from "@/data/services/productService";
import type { Product } from "@/domain/entities/product";

type ProductState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (params?: Record<string, string | number | boolean | null | undefined>) => Promise<void>;
  getProductBySlug: (slug: string) => Promise<{ product: Product; related: Product[] } | null>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProducts(params);
      if (response.success) {
        set({ products: response.data.data, isLoading: false });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      set({ error: message, isLoading: false });
    }
  },

  getProductBySlug: async (slug) => {
    try {
      const response = await productService.getProduct(slug);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  },
}));
