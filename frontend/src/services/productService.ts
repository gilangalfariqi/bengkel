import { apiFetch } from "./api/http";

export interface ProductBadge {
  id: number;
  label: string;
  color: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string | null;
  stock: number;
  weight: number;
  brand: string | null;
  specifications: Record<string, unknown>;
  is_active: boolean;
  active_badge?: ProductBadge | null;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  primary_image?: {
    image_path: string;
  };
  images?: {
    image_path: string;
    is_primary: boolean;
  }[];
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

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
