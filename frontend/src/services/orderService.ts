import { http } from "./api/http";

export interface CreateOrderRequest {
  shipping_cost: number;
  courier: string;
  service: string;
  recipient_name: string;
  recipient_phone: string;
  province: string;
  city: string;
  postal_code: string;
  address_detail: string;
  notes?: string;
}

export interface PaymentData {
  snap_token: string;
}

export interface OrderData {
  payment: PaymentData;
}

export interface CreateOrderResponse {
  data: OrderData;
}

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const res = await http.post<OrderData>("/api/orders", data);
    // Backend always returns OrderData on success, but keep runtime safety.
    if (!res.success || res.data === null) {
      throw new Error(res.message);
    }
    return { data: res.data };
  },

  getOrderHistory: async () => {
    const res = await http.get("/api/orders");
    return res.data;
  },

  getOrderDetail: async (id: number) => {
    const res = await http.get(`/api/orders/${id}`);
    return res.data;
  }
};
