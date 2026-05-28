"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useCartStore } from "@/presentation/stores/cartStore";
import { useProductStore } from "@/presentation/stores/productStore";
import ProductSkeleton from "@/presentation/components/product/ProductSkeleton";
import EmptyState from "@/presentation/components/ui/EmptyState";
import { getImageUrl, formatIDR } from "@/lib/formatters";

export default function CartPage() {
  const { items, hydrate, setQty, removeItem } = useCartStore();
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    hydrate();
    fetchProducts();
  }, [hydrate, fetchProducts]);

  const cartLines = useMemo(() => {
    return items
      .map((line) => {
        const p = products.find((pp) => pp.id === line.productId);
        if (!p) return null;
        const price = parseFloat(p.discount_price || p.price);
        return { product: p, qty: line.qty, lineTotal: price * line.qty };
      })
      .filter(Boolean) as Array<{
        product: (typeof products)[number];
        qty: number;
        lineTotal: number;
      }>;
  }, [items, products]);

  const subtotal = cartLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const totalItems = cartLines.reduce((sum, l) => sum + l.qty, 0);

  function handleRemove(productId: number, name: string) {
    removeItem(productId);
    toast(`${name} dihapus dari keranjang`, { duration: 2000 });
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="h-6 w-36 rounded-full animate-shimmer-dark mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl animate-shimmer-dark" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-36 md:pb-8">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-lg font-black text-foreground tracking-tight">Keranjang Belanja</h1>
            {cartLines.length > 0 && (
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                {cartLines.length} produk · {totalItems} item
              </p>
            )}
          </div>
        </div>
      </div>

      {cartLines.length === 0 ? (
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="card">
            <EmptyState variant="cart" />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 max-w-2xl space-y-3">
          {/* ── Cart items ────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {cartLines.map(({ product, qty, lineTotal }) => {
              const imageUrl = getImageUrl(product.primary_image?.image_path);
              const unitPrice = parseFloat(product.discount_price || product.price);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="card flex gap-3 p-3"
                >
                  {/* Thumbnail */}
                  <Link href={`/products/${product.slug}`} className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-secondary/30 border border-border">
                    <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        {product.brand ?? "Original"}
                      </div>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 mt-0.5 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="text-xs font-black text-foreground mt-1">
                        {formatIDR(unitPrice)}
                      </div>
                    </div>

                    {/* Qty + remove */}
                    <div className="flex items-center justify-between mt-2">
                      {/* Stepper */}
                      <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-2 py-1 border border-border/50">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => setQty(product.id, Math.max(1, qty - 1))}
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Kurangi"
                        >
                          <Minus className="h-3 w-3" />
                        </motion.button>
                        <span className="w-5 text-center text-xs font-black text-foreground">{qty}</span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => setQty(product.id, qty + 1)}
                          disabled={qty >= product.stock}
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                          aria-label="Tambah"
                        >
                          <Plus className="h-3 w-3" />
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-foreground">{formatIDR(lineTotal)}</span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleRemove(product.id, product.name)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          aria-label={`Hapus ${product.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* ── Order Summary ─────────────────────────────────── */}
          <div className="card p-5 space-y-4 mt-4">
            <h2 className="section-eyebrow">Ringkasan Order</h2>

            <div className="space-y-2 text-sm">
              {cartLines.map(({ product, qty, lineTotal }) => (
                <div key={product.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate max-w-[200px]">
                    {product.name} ×{qty}
                  </span>
                  <span className="font-bold shrink-0 ml-4">{formatIDR(lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Total Produk</div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                  *Ongkir & metode bayar dikonfirmasi via WhatsApp
                </div>
              </div>
              <span className="text-xl font-black text-primary tracking-tight">{formatIDR(subtotal)}</span>
            </div>
          </div>

          {/* Lanjut belanja */}
          <Link
            href="/catalog"
            className="flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Lanjut Belanja
          </Link>
        </div>
      )}

      {/* ── Floating CTA ──────────────────────────────────────── */}
      {cartLines.length > 0 && (
        <div className="fixed bottom-[5.25rem] left-0 right-0 z-50 md:bottom-0 px-4 pb-4 md:pb-6">
          <div className="container mx-auto max-w-2xl">
            <div className="glass rounded-2xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Total</div>
                <div className="text-base font-black text-primary tracking-tight">{formatIDR(subtotal)}</div>
              </div>
              <Link
                href="/checkout"
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-glow hover:shadow-[0_0_24px_rgba(225,29,72,0.4)] active:scale-95 transition-all duration-200 tap-highlight-none shrink-0"
              >
                Checkout
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
