"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/presentation/stores/cartStore";

export default function CartButton() {
  const { items } = useCartStore();
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <Link
      href="/cart"
      className="btn-icon relative inline-flex items-center justify-center"
      aria-label={`Keranjang${count > 0 ? ` (${count} item)` : ""}`}
    >
      <ShoppingCart className="h-4.5 w-4.5" />
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
