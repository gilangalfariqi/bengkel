import { http } from "@/data/api/httpClient";
import type { CreateOrderRequest, CreateOrderResponse, OrderData } from "@/domain/entities/order";

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const res = await http.post<OrderData>("/api/orders", data);
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
