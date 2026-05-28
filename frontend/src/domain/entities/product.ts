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
