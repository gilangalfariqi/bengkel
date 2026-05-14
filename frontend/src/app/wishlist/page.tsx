"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

import { useWishlistStore } from "@/stores/wishlistStore";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";


function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

export default function WishlistPage() {
  const { productIds, hydrate, toggle } = useWishlistStore();
  const { products, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    hydrate();
    fetchProducts();
  }, [hydrate, fetchProducts]);

  const wishlistProducts = useMemo(() => {
    return productIds.map((id) => products.find(p => p.id === id)).filter(Boolean) as typeof products;
  }, [productIds, products]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-8 mb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight">Wishlist.</h1>
          <p className="text-muted-foreground text-lg">Your curated collection of premium performance parts.</p>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
            <Heart className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
Save the parts you&apos;re eyeing for later.
          </div>
          <Link
            href="/catalog"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-primary px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:scale-105"
          >
            Explore Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistProducts.map((p) => {
            const price = parseFloat(p.discount_price || p.price);
            const imageUrl = p.primary_image?.image_path 
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/storage/${p.primary_image.image_path}`
              : "https://images.unsplash.com/photo-1520975693415-35a64c9fc0c8?auto=format&fit=crop&w=800&q=80";

            return (
              <div key={p.id} className="group relative flex flex-col overflow-hidden rounded-[2rem] border bg-card shadow-premium transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      <button
                        type="button"
                        title="Remove from wishlist"
                        aria-label="Remove from wishlist"
                        onClick={() => toggle(p.id)}
                    className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary backdrop-blur-xl transition-all hover:scale-110"
                  >
                    <Heart className="h-5 w-5 fill-primary" />
                  </button>
                  
                  <Link href={`/products/${p.slug}`} className="block h-full">
                    <Image src={imageUrl} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </Link>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{p.brand || 'Original'}</div>
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="line-clamp-2 text-lg font-bold leading-tight hover:text-primary transition-colors">{p.name}</h3>
                    </Link>
                  </div>

                  <div className="mt-auto">
                    <div className="text-xl font-black mb-6">{formatIDR(price)}</div>
                    <div className="flex gap-2">
                      <button
                        title="Add to cart"
                        onClick={() => addItem(p.id, 1)}
                        disabled={p.stock <= 0}
                        className="flex-1 flex h-12 items-center justify-center gap-2 rounded-2xl bg-foreground text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary disabled:opacity-50"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> Add
                      </button>
                      <button
                        type="button"
                        aria-label="Remove from wishlist"
                        onClick={() => toggle(p.id)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

