"use client";

import { type ReactNode, useEffect } from "react";

import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useProductStore } from "@/stores/productStore";

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

