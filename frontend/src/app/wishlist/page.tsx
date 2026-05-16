"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, Home, Bell, Loader2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

import { useWishlistStore } from "@/stores/wishlistStore";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

export default function WishlistPage() {
  const { productIds, hydrate, toggle } = useWishlistStore();
  const { products, fetchProducts, isLoading } = useProductStore();
  const { addItem } = useCartStore();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    hydrate();
    fetchProducts();
  }, [hydrate, fetchProducts]);

  const wishlistProducts = useMemo(() => {
    return productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
  }, [productIds, products]);

  // Clean up selectedItems if an item is removed from the wishlist entirely
  useEffect(() => {
    setSelectedItems((prev) => prev.filter((id) => productIds.includes(id)));
  }, [productIds]);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addSelectedToCart = () => {
    selectedItems.forEach((id) => addItem(id, 1));
    // Optional: unselect or clear them from wishlist after adding to cart
    setSelectedItems([]);
    alert("Berhasil menambahkan item pilihan ke keranjang!");
  };

  const removeSelectedFromWishlist = () => {
    selectedItems.forEach((id) => toggle(id));
    setSelectedItems([]);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* ── App Header (Mobile) ────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm px-4 h-14 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-none">Wishlist</h1>
          <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{wishlistProducts.length} item</p>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <Link href="/">
            <Home className="h-5 w-5" />
          </Link>
          <button>
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {wishlistProducts.length === 0 ? (
          /* ── Empty State ────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
              <Heart className="h-10 w-10" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Wishlist masih kosong</h2>
            <p className="text-sm text-gray-500 max-w-xs mb-8">
              Simpan produk favoritmu di sini agar mudah ditemukan nanti.
            </p>
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-xs font-bold text-white transition hover:bg-primary/90 shadow-glow"
            >
              JELAJAHI PRODUK
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {/* ── Wishlist Items ────────────────────────────────────────── */}
            {wishlistProducts.map((p) => {
              const isSelected = selectedItems.includes(p.id);
              const price = parseFloat(p.discount_price || p.price);
              const imageUrl = p.primary_image?.image_path
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/storage/${p.primary_image.image_path}`
                : "https://images.unsplash.com/photo-1520975693415-35a64c9fc0c8?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={p.id}
                  className={cn(
                    "flex gap-3 bg-white p-4 rounded-2xl border transition-all relative",
                    isSelected ? "border-primary/40 bg-rose-50/20" : "border-gray-100 shadow-sm"
                  )}
                >
                  {/* Checkbox */}
                  <div className="pt-2 shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(p.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                    />
                  </div>

                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                    <Image src={imageUrl} alt={p.name} fill className="object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="pr-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">
                        {p.brand || "Original"}
                      </p>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5">
                        {p.name}
                      </h3>
                    </div>

                    <div className="font-black text-gray-900 mt-2">
                      {formatIDR(price)}
                    </div>
                  </div>

                  {/* Heart Toggle */}
                  <button
                    onClick={() => toggle(p.id)}
                    className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-full text-primary hover:bg-rose-50 transition"
                  >
                    <Heart className="h-5 w-5 fill-primary" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Sticky Bulk Action Bar ────────────────────────────── */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-[4rem] md:bottom-0 inset-x-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50"
        >
          <div className="container mx-auto max-w-4xl flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900">{selectedItems.length} item dipilih</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Add to Cart Bulk */}
              <button
                onClick={addSelectedToCart}
                className="flex h-10 px-6 items-center justify-center rounded-xl bg-primary text-[10px] font-bold uppercase tracking-wide text-white transition-all hover:bg-primary/90 shadow-glow"
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                Tambah Ke Keranjang
              </button>

              {/* Delete Bulk */}
              <button
                onClick={removeSelectedFromWishlist}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
