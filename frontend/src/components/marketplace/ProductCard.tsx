"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { motion } from "framer-motion";

import type { Product } from "@/services/productService";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { productIds, toggle } = useWishlistStore();

  const wished = productIds.includes(product.id);
  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const hasDiscount = discountPrice !== null && discountPrice < price;
  const discountPct = hasDiscount ? Math.round(((price - discountPrice!) / price) * 100) : 0;

  const imageUrl = product.primary_image?.image_path 
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/storage/${product.primary_image.image_path}`
    : "https://images.unsplash.com/photo-1520975693415-35a64c9fc0c8?auto=format&fit=crop&w=800&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/20 dark:border-white/5 bg-card/40 backdrop-blur-md shadow-premium transition-all duration-500 hover:shadow-glow hover:-translate-y-2 h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {hasDiscount && (
          <div className="absolute left-3 top-3 z-20 rounded-full premium-gradient px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.1em] text-white shadow-xl">
            {discountPct}% OFF
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className={cn(
            "absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full glass backdrop-blur-2xl transition-all duration-300 hover:scale-110 active:scale-95",
            wished ? "text-primary border-primary/20 bg-primary/10 shadow-glow" : "text-muted-foreground hover:text-primary"
          )}
        >
          <Heart className={cn("h-4 w-4 transition-all duration-300", wished && "fill-primary scale-110")} />
        </button>

        <Link href={`/products/${product.slug}`} className="block h-full relative">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-1000 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black scale-50 group-hover:scale-100 transition-all duration-500 shadow-2xl">
              <Eye className="h-5 w-5" />
            </div>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 pt-3 sm:pt-4">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 truncate max-w-[60px]">{product.brand || 'Original'}</span>
            <div className="flex items-center gap-1 rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[8px] font-bold text-amber-600">
              <Star className="h-2.5 w-2.5 fill-amber-500" />
              4.8
            </div>
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="line-clamp-2 text-sm sm:text-base font-black leading-tight transition-colors group-hover:text-primary tracking-tight h-10">{product.name}</h3>
          </Link>
        </div>

        <div className="mt-auto">
          <div className="flex flex-col mb-4">
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-black text-foreground tracking-tighter">
                {formatIDR(hasDiscount ? discountPrice! : price)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] font-bold text-muted-foreground line-through opacity-50">
                  {formatIDR(price)}
                </span>
              )}
            </div>
            <div className="text-[8px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mt-0.5">
              86 Sold • {product.stock} Stock
            </div>
          </div>

          <button
            onClick={() => addItem(product.id, 1)}
            disabled={product.stock <= 0}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3 text-[9px] font-black uppercase tracking-[0.2em] text-background transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-50 group/btn shadow-premium hover:shadow-glow"
          >
            <ShoppingCart className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
            {product.stock > 0 ? 'Add' : 'Empty'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

