"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlistStore } from "@/presentation/stores/wishlistStore";

export default function WishlistButton() {
  const { productIds } = useWishlistStore();
  const count = productIds.length;

  return (
    <Link
      href="/wishlist"
      className="btn-icon relative inline-flex items-center justify-center"
      aria-label={`Wishlist${count > 0 ? ` (${count} item)` : ""}`}
    >
      <Heart className={`h-4.5 w-4.5 transition-all ${count > 0 ? "fill-primary text-primary" : ""}`} />
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white px-0.5 leading-none"
        >
          {count > 9 ? "9+" : count}
        </motion.span>
      )}
    </Link>
  );
}
