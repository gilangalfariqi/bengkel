import { apiFetch } from "@/data/api/httpClient";
import type { Product, PaginatedResponse } from "@/domain/entities/product";

export const productService = {
  getProducts: (params?: Record<string, string | number | boolean | null | undefined>) => {
    const sanitized: Record<string, string | number | boolean> | undefined = params
      ? (Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== null && v !== undefined)
        ) as Record<string, string | number | boolean>)
      : undefined;

    return apiFetch<PaginatedResponse<Product>>("/api/products", { params: sanitized });
  },

  getProduct: (slug: string) =>
    apiFetch<{ product: Product; related: Product[] }>(`/api/products/${slug}`),
};
