"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Search, Package } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "cart" | "wishlist" | "search" | "orders";

interface EmptyStateProps {
  variant?: Variant;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
  className?: string;
}

const VARIANTS: Record<
  Variant,
  { icon: React.ElementType; title: string; description: string; ctaLabel: string; ctaHref: string }
> = {
  cart: {
    icon: ShoppingBag,
    title: "Keranjang masih kosong",
    description: "Temukan sparepart terbaik untuk kendaraan Anda.",
    ctaLabel: "Mulai Belanja",
    ctaHref: "/catalog",
  },
  wishlist: {
    icon: Heart,
    title: "Belum ada produk favorit",
    description: "Simpan produk yang Anda suka agar mudah ditemukan.",
    ctaLabel: "Jelajahi Produk",
    ctaHref: "/catalog",
  },
  search: {
    icon: Search,
    title: "Produk tidak ditemukan",
    description: "Coba ubah kata kunci atau reset filter pencarian.",
    ctaLabel: "Reset Pencarian",
    ctaHref: "/catalog",
  },
  orders: {
    icon: Package,
    title: "Belum ada pesanan",
    description: "Riwayat pesanan Anda akan muncul di sini.",
    ctaLabel: "Mulai Belanja",
    ctaHref: "/catalog",
  },
};

export default function EmptyState({
  variant = "search",
  title,
  description,
  ctaLabel,
  ctaHref,
  onCta,
  className,
}: EmptyStateProps) {
  const config = VARIANTS[variant];
  const Icon = config.icon;
  const finalTitle = title ?? config.title;
  const finalDesc = description ?? config.description;
  const finalLabel = ctaLabel ?? config.ctaLabel;
  const finalHref = ctaHref ?? config.ctaHref;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "flex flex-col items-center justify-center text-center py-16 px-6",
          className,
        )}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="relative mb-6"
        >
          <div className="h-20 w-20 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground/40">
            <Icon className="h-9 w-9" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 rounded-2xl border border-primary/10 scale-110 opacity-50" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 mb-8"
        >
          <h3 className="text-base font-bold text-foreground">{finalTitle}</h3>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {finalDesc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {onCta ? (
            <button
              onClick={onCta}
              className="btn btn-primary"
            >
              {finalLabel}
            </button>
          ) : (
            <Link href={finalHref} className="btn btn-primary">
              {finalLabel}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
