"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Loader2, Minus, Plus, Trash2, ShoppingBag, ArrowRight, X, Home, Bell } from "lucide-react";
import { motion } from "framer-motion";

import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

export default function CartPage() {
  const { items, hydrate, setQty, removeItem, clearCart } = useCartStore();
  const { products, fetchProducts, isLoading: productsLoading } = useProductStore();
  const { productIds, toggle: toggleWishlist } = useWishlistStore();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    hydrate();
    fetchProducts();
  }, [hydrate, fetchProducts]);

  const cartLines = useMemo(() => {
    return items
      .map((line) => {
        const p = products.find((p) => p.id === line.productId);
        if (!p) return null;
        const price = parseFloat(p.discount_price || p.price);
        return { product: p, qty: line.qty, lineTotal: price * line.qty };
      })
      .filter(Boolean) as Array<{ product: (typeof products)[number]; qty: number; lineTotal: number }>;
  }, [items, products]);

  // Handle Select All
  useEffect(() => {
    // By default select all items if none are selected, or keep selection if user manages it
    if (cartLines.length > 0 && selectedItems.length === 0) {
      setSelectedItems(cartLines.map((l) => l.product.id));
    }
  }, [cartLines, selectedItems.length]);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = cartLines.length > 0 && selectedItems.length === cartLines.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartLines.map((l) => l.product.id));
    }
  };

  const selectedLines = cartLines.filter((l) => selectedItems.includes(l.product.id));
  const subtotal = selectedLines.reduce((sum, l) => sum + l.lineTotal, 0);

  // Free shipping logic (mock)
  const freeShippingTarget = 1000000;
  const remainingForFreeShipping = Math.max(0, freeShippingTarget - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingTarget) * 100);

  if (productsLoading) {
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
          <h1 className="text-lg font-bold text-gray-900 leading-none">Keranjang</h1>
          <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{cartLines.length} item</p>
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
        {cartLines.length === 0 ? (
          /* ── Empty State ────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Keranjang masih kosong</h2>
            <p className="text-sm text-gray-500 max-w-xs mb-8">
              Yuk, temukan produk terbaik untuk kendaraan Anda.
            </p>
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-xs font-bold text-white transition hover:bg-primary/90 shadow-glow"
            >
              MULAI BELANJA
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ── Free Shipping Progress ────────────────────────────── */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-4 items-center">
              <div className="h-10 w-10 shrink-0 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 mb-2 truncate">
                  {remainingForFreeShipping > 0
                    ? `Belanja ${formatIDR(remainingForFreeShipping)} lagi untuk gratis ongkir!`
                    : "Selamat! Anda mendapatkan gratis ongkir."}
                </p>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Select All Row */}
            <div className="flex items-center gap-3 px-1 py-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
              />
              <span className="text-sm font-bold text-gray-700">Pilih Semua</span>
            </div>

            {/* ── Cart Items ────────────────────────────────────────── */}
            <div className="space-y-3">
              {cartLines.map(({ product, qty, lineTotal }) => {
                const isSelected = selectedItems.includes(product.id);
                const price = parseFloat(product.discount_price || product.price);
                const imageUrl = product.primary_image?.image_path
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/storage/${product.primary_image.image_path}`
                  : "https://images.unsplash.com/photo-1520975693415-35a64c9fc0c8?auto=format&fit=crop&w=800&q=80";

                return (
                  <div
                    key={product.id}
                    className="flex gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative"
                  >
                    {/* Checkbox */}
                    <div className="pt-2 shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(product.id)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                      />
                    </div>

                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="pr-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">
                          {product.brand || "Original"}
                        </p>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">SKU: BP-{product.id}</p>
                      </div>

                      <div className="font-black text-gray-900 mt-2">
                        {formatIDR(price)}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Qty */}
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-1">
                          <button
                            onClick={() => setQty(product.id, Math.max(1, qty - 1))}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-primary transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{qty}</span>
                          <button
                            onClick={() => setQty(product.id, qty + 1)}
                            disabled={qty >= product.stock}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-primary transition disabled:opacity-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Trash */}
                        <button
                          onClick={() => removeItem(product.id)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Top Right Remove X (Optional, reference shows it) */}
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── Summary ────────────────────────────────────────────── */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mt-6 mb-24">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Ringkasan Order</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({selectedItems.length} item)</span>
                  <span className="font-semibold">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Diskon</span>
                  <span>- Rp 0</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Ongkir (Estimasi)</span>
                  <span>Dihitung saat checkout</span>
                </div>
              </div>
              <div className="h-px bg-gray-100 my-4" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-lg font-black text-primary">{formatIDR(subtotal)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky Bottom Action Bar ────────────────────────────── */}
      {cartLines.length > 0 && (
        <div className="fixed bottom-[4rem] md:bottom-0 inset-x-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
          <div className="container mx-auto max-w-4xl flex flex-col gap-3">
            <Link
              href="/checkout"
              className={cn(
                "flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold uppercase tracking-wide text-white transition-all shadow-glow",
                selectedItems.length > 0
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-gray-300 shadow-none cursor-not-allowed pointer-events-none"
              )}
            >
              PROCEED TO CHECKOUT
            </Link>
            <Link
              href="/catalog"
              className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              LANJUT BELANJA
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
