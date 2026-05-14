import { http } from "./api/http";

export const cartService = {
  getCart: async () => {
    const res = await http.get("/api/cart");
    return res.data;
  },

  syncCart: async (items: { productId: number; qty: number }[]) => {
    // Clear the backend cart first
    await http.delete("/api/cart");
    
    for (const item of items) {
      await http.post("/api/cart", {
        product_id: item.productId,
        quantity: item.qty
      });
    }
  }
};
