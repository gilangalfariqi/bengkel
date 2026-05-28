export interface CreateOrderRequest {
  shipping_cost: number;
  courier: string;
  service: string;
  recipient_name: string;
  recipient_phone: string;
  province?: string;
  city?: string;
  postal_code?: string;
  address_detail?: string;
  notes?: string;
}

export interface PaymentData {
  id?: number;
  snap_token: string | null;
  payment_type?: string | null;
  status?: string;
  amount?: number | string;
}

export interface OrderItemData {
  id: number;
  product_id: number;
  quantity: number;
  price: number | string;
  product?: {
    id: number;
    name: string;
    price: string;
    discount_price: string | null;
  } | null;
}

export interface OrderData {
  id: number;
  order_number: string;
  total_amount: number | string;
  status: string;
  shipping_cost: number | string;
  shipping_courier: string | null;
  shipping_service: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  province: string | null;
  city: string | null;
  postal_code: string | null;
  address_detail: string | null;
  notes: string | null;
  payment: PaymentData;
  items?: OrderItemData[];
  created_at: string;
}

export interface CreateOrderResponse {
  data: OrderData;
}
