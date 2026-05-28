"use client";

import { type ReactNode, useEffect } from "react";

import { useAuthStore } from "@/presentation/stores/authStore";
import { useCartStore } from "@/presentation/stores/cartStore";
import { useWishlistStore } from "@/presentation/stores/wishlistStore";
import { useProductStore } from "@/presentation/stores/productStore";

export default function LayoutStateHydrator({ children }: { children: ReactNode }) {
  const { hydrate: hydrateAuth } = useAuthStore();
  const { hydrate: hydrateCart } = useCartStore();
  const { hydrate: hydrateWishlist } = useWishlistStore();
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    hydrateAuth();
    hydrateCart();
    hydrateWishlist();
    fetchProducts();
  }, [hydrateAuth, hydrateCart, hydrateWishlist, fetchProducts]);

  return <>{children}</>;
}
