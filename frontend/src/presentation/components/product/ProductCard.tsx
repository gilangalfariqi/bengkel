"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import type { Product } from "@/domain/entities/product";
import { useCartStore } from "@/presentation/stores/cartStore";
import { useWishlistStore } from "@/presentation/stores/wishlistStore";
import { cn } from "@/lib/utils";
import { getImageUrl, formatIDR, calcDiscountPct } from "@/lib/formatters";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { productIds, toggle } = useWishlistStore();

  const wished = productIds.includes(product.id);
  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const hasDiscount = discountPrice !== null && discountPrice < price;
  const discountPct = hasDiscount ? calcDiscountPct(price, discountPrice!) : 0;
  const badge = product.active_badge ?? null;

  const imageUrl = getImageUrl(product.primary_image?.image_path);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock <= 0) return;
    addItem(product.id, 1);
    toast.success("Ditambahkan ke keranjang", {
      description: product.name,
      duration: 2000,
    });
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggle(product.id);
    toast(wished ? "Dihapus dari wishlist" : "Ditambahkan ke wishlist", {
      duration: 1800,
    });
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(225,29,72,0.08)] transition-all duration-300 h-full tap-highlight-none"
    >
      {/* ── Image ─────────────────────────────────────────────── */}
      <div className="relative aspect-product overflow-hidden bg-secondary/30 shrink-0">
        {/* Badge — brand-driven */}
        {badge && (
          <div
            className="absolute left-2 top-2 z-20 badge text-white"
            style={{ backgroundColor: badge.color || "#E11D48" }}
          >
            {badge.label}
          </div>
        )}

        {/* Discount badge */}
        {!badge && hasDiscount && (
          <div className="absolute left-2 top-2 z-20 badge badge-solid-red">
            -{discountPct}%
          </div>
        )}

        {/* Stock out badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span className="badge bg-black/80 text-white border border-white/20">Habis</span>
          </div>
        )}

        {/* Wishlist button */}
        <motion.button
          type="button"
          aria-label={wished ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
          onClick={handleWishlist}
          whileTap={{ scale: 0.85 }}
          className={cn(
            "absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-xl border backdrop-blur-md shadow-sm transition-all duration-200",
            wished
              ? "bg-primary/15 border-primary/30 text-primary"
              : "bg-card/80 border-border text-muted-foreground hover:text-primary hover:border-primary/20",
          )}
        >
          <Heart
            className={cn("h-3.5 w-3.5 transition-all duration-200", wished && "fill-primary")}
          />
        </motion.button>

        {/* Product image */}
        <Link href={`/products/${product.slug}`} className="block h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        </Link>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-3">
        {/* Brand + Rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground truncate max-w-[80px]">
            {product.brand ?? "Original"}
          </span>
          <div className="flex items-center gap-0.5 text-[9px] font-black text-amber-400">
            <Star className="h-2.5 w-2.5 fill-amber-400 stroke-none" />
            <span>5.0</span>
          </div>
        </div>

        {/* Name */}
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-[0.8rem] font-bold leading-snug text-foreground hover:text-primary transition-colors min-h-[2.4rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 pt-2 border-t border-border/40">
          {/* Price */}
          <div className="mb-2.5">
            <div className="text-sm font-black text-foreground tracking-tight">
              {formatIDR(hasDiscount ? discountPrice! : price)}
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-muted-foreground line-through opacity-50">
                  {formatIDR(price)}
                </span>
                <span className="text-[8px] font-black text-primary bg-primary/10 rounded px-1 py-0.5">
                  -{discountPct}%
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            whileTap={{ scale: product.stock > 0 ? 0.95 : 1 }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 py-2.5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary/10 disabled:hover:text-primary disabled:hover:border-primary/20 cursor-pointer"
          >
            <ShoppingCart className="h-3 w-3" />
            {product.stock > 0 ? "Tambah" : "Habis"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
