"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useWishlistStore } from "@/stores/wishlistStore";

export default function WishlistButton() {
  const { productIds } = useWishlistStore();
  const count = productIds.length;

  return (
    <Link href="/wishlist" className="relative inline-flex items-center gap-2 rounded-xl bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-background md:inline-flex">
      <Heart className="h-4 w-4" />
      <span className="hidden lg:inline">Wishlist</span>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

