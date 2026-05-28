"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useWishlistStore } from "@/presentation/stores/wishlistStore";
import { useProductStore } from "@/presentation/stores/productStore";
import { useCartStore } from "@/presentation/stores/cartStore";
import ProductSkeleton from "@/presentation/components/product/ProductSkeleton";
import EmptyState from "@/presentation/components/ui/EmptyState";
import { getImageUrl, formatIDR } from "@/lib/formatters";

export default function WishlistPage() {
  const { productIds, hydrate, toggle } = useWishlistStore();
  const { products, fetchProducts, isLoading } = useProductStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    hydrate();
    fetchProducts();
  }, [hydrate, fetchProducts]);

  const wishlistProducts = useMemo(
    () => productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products,
    [productIds, products],
  );

  function handleAddToCart(id: number, name: string) {
    addItem(id, 1);
    toast.success(`${name} ditambahkan ke keranjang`, { duration: 2000 });
  }

  function handleRemove(id: number, name: string) {
    toggle(id);
    toast(`${name} dihapus dari wishlist`, { duration: 1800 });
  }

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-8">
      <div className="container mx-auto px-4 pt-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-5 w-5 text-primary fill-primary" />
          <div>
            <h1 className="text-lg font-black text-foreground tracking-tight">Wishlist</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
              {wishlistProducts.length} produk tersimpan
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="card">
            <EmptyState variant="wishlist" />
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {wishlistProducts.map((p) => {
                const imageUrl = getImageUrl(p.primary_image?.image_path);
                const price = parseFloat(p.discount_price || p.price);
                const originalPrice = parseFloat(p.price);
                const hasDiscount = p.discount_price && price < originalPrice;

                return (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative aspect-product overflow-hidden bg-secondary/30">
                      {hasDiscount && (
                        <div className="absolute left-2 top-2 z-10 badge badge-solid-red">
                          Sale
                        </div>
                      )}
                      {/* Remove from wishlist */}
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleRemove(p.id, p.name)}
                        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                        aria-label="Hapus dari wishlist"
                      >
                        <Heart className="h-3.5 w-3.5 fill-current" />
                      </motion.button>
                      <Link href={`/products/${p.slug}`} className="block h-full">
                        <Image
                          src={imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                          sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 20vw"
                        />
                      </Link>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-3">
                      <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        {p.brand ?? "Original"}
                      </div>
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="text-[0.8rem] font-bold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors min-h-[2.4rem]">
                          {p.name}
                        </h3>
                      </Link>

                      <div className="mt-auto pt-2 border-t border-border/40 mt-2">
                        <div className="text-sm font-black text-foreground mb-2">{formatIDR(price)}</div>
                        <div className="flex gap-1.5">
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleAddToCart(p.id, p.name)}
                            disabled={p.stock <= 0}
                            className="flex flex-1 h-9 items-center justify-center gap-1.5 rounded-xl bg-primary text-[9px] font-black uppercase tracking-widest text-white shadow-glow-sm hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            {p.stock > 0 ? "Tambah" : "Habis"}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => handleRemove(p.id, p.name)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/8 transition-all"
                            aria-label="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
