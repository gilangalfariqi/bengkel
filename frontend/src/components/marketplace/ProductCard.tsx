"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "@/services/productService";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { productIds, toggle } = useWishlistStore();

  const wished = productIds.includes(product.id);
  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const hasDiscount = discountPrice !== null && discountPrice < price;
  const discountPct = hasDiscount
    ? Math.round(((price - discountPrice!) / price) * 100)
    : 0;

  const badge = product.active_badge ?? null;

  const imageUrl = product.primary_image?.image_path
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/storage/${product.primary_image.image_path}`
    : "https://images.unsplash.com/photo-1520975693415-35a64c9fc0c8?auto=format&fit=crop&w=800&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full"
    >
      {/* ── Image ─────────────────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Badge — API-driven */}
        {badge && (
          <div
            className="absolute left-2.5 top-2.5 z-20 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm"
            style={{ backgroundColor: badge.color || "#E11D48" }}
          >
            {badge.label}
          </div>
        )}

        {/* Discount badge — fallback if no custom badge */}
        {!badge && hasDiscount && (
          <div className="absolute left-2.5 top-2.5 z-20 rounded-lg bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
            -{discountPct}%
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className={cn(
            "absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-200 hover:scale-110 active:scale-95",
            wished ? "text-primary border-primary/30" : "text-gray-400 hover:text-primary"
          )}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-all duration-200",
              wished && "fill-primary"
            )}
          />
        </button>

        <Link href={`/products/${product.slug}`} className="block h-full relative">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </Link>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-3">
        {/* Brand + Rating */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 truncate max-w-[70px]">
            {product.brand || "Original"}
          </span>
          <div className="flex items-center gap-0.5 text-[9px] font-semibold text-amber-500">
            <Star className="h-2.5 w-2.5 fill-amber-400 stroke-none" />
            <span>4.8</span>
            <span className="text-gray-400 font-normal">(120)</span>
          </div>
        </div>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-gray-900 hover:text-primary transition-colors mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Price */}
          <div className="mb-2.5">
            <div className="text-sm font-black text-gray-900">
              {formatIDR(hasDiscount ? discountPrice! : price)}
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-gray-400 line-through">
                  {formatIDR(price)}
                </span>
                <span className="text-[9px] font-bold text-primary bg-rose-50 rounded px-1 py-0.5">
                  -{discountPct}%
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addItem(product.id, 1)}
            disabled={product.stock <= 0}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[10px] font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-glow"
          >
            <ShoppingCart className="h-3 w-3" />
            {product.stock > 0 ? "Tambah" : "Habis"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
