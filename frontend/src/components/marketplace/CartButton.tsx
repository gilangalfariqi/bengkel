"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/stores/cartStore";

function getCartCount(items: { productId: number; qty: number }[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export default function CartButton() {
  const { items } = useCartStore();
  const count = getCartCount(items);

  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-red-600/10 to-orange-500/10 px-3 py-2 text-sm font-medium text-red-600 hover:bg-gradient-to-br md:inline-flex">
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden lg:inline">Keranjang</span>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

