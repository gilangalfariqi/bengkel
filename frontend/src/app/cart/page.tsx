"use client";

import { useEffect, useMemo } from "react";

import Image from "next/image";
import Link from "next/link";
import { Heart, Loader2, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
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
  const { productIds, toggle } = useWishlistStore();

  useEffect(() => {
    hydrate();
    fetchProducts();
  }, [hydrate, fetchProducts]);

  const cartLines = useMemo(() => {
    return items
      .map((line) => {
        const p = products.find(p => p.id === line.productId);
        if (!p) return null;
        const price = parseFloat(p.discount_price || p.price);
        return { product: p, qty: line.qty, lineTotal: price * line.qty };
      })
      .filter(Boolean) as Array<{ product: (typeof products)[number]; qty: number; lineTotal: number }>;
  }, [items, products]);

  const subtotal = useMemo(() => {
    return cartLines.reduce((sum, l) => sum + l.lineTotal, 0);
  }, [cartLines]);

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Syncing your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <div className="flex flex-col gap-12 mb-16">
        <div className="space-y-4 max-w-2xl">
          <div className="text-xs font-black uppercase tracking-[0.4em] text-primary">Your Selection</div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">Cart.</h1>
          <p className="text-muted-foreground text-xl leading-relaxed">Review your selection before we prepare your shipment.</p>
        </div>
      </div>

      {cartLines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 glass rounded-[3rem]">
          <div className="h-24 w-24 rounded-[2rem] bg-secondary flex items-center justify-center text-muted-foreground animate-float">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Your cart is empty</h2>
Looks like you haven&apos;t added any premium parts yet. Explore our catalog to find what you need.
          </div>
          <Link
            href="/catalog"
            className="inline-flex h-16 items-center justify-center gap-4 rounded-full bg-primary px-12 text-[10px] font-black uppercase tracking-widest text-white shadow-glow transition-all hover:scale-105 active:scale-95"
          >
            Start Exploring Catalog <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            {cartLines.map(({ product, qty, lineTotal }) => {
              const wished = productIds.includes(product.id);
              const price = parseFloat(product.discount_price || product.price);
              const imageUrl = product.primary_image?.image_path 
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/storage/${product.primary_image.image_path}`
                : "https://images.unsplash.com/photo-1520975693415-35a64c9fc0c8?auto=format&fit=crop&w=800&q=80";

              return (
                <motion.div 
                  layout
                  key={product.id} 
                  className="group relative flex flex-col sm:flex-row gap-8 p-8 rounded-[2.5rem] border border-white/20 dark:border-white/5 bg-card/40 backdrop-blur-md shadow-premium transition-all duration-500 hover:shadow-glow"
                >
                  <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-[2rem] bg-muted shadow-lg">
                    <Image src={imageUrl} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">{product.brand || 'Original'}</div>
                        <Link href={`/products/${product.slug}`} className="text-2xl font-black hover:text-primary transition-colors tracking-tight line-clamp-2">
                          {product.name}
                        </Link>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          SKU: BP-{product.id.toString().padStart(6, '0')}
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        title={wished ? "Remove from wishlist" : "Add to wishlist"}
                        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                        onClick={() => toggle(product.id)}
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full glass transition-all duration-300",
                          wished ? "bg-primary/10 text-primary shadow-glow" : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        <Heart className={cn("h-5 w-5 transition-all duration-300", wished && "fill-primary scale-110")} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-6 mt-8 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-2 rounded-2xl bg-secondary/50 p-1.5 backdrop-blur-md">
                      <button
                        type="button"
                        title="Decrease quantity"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(product.id, Math.max(1, qty - 1))}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm hover:bg-primary hover:text-white transition-all duration-300"
                      >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-lg font-black tracking-tighter">{qty}</span>
                        <button
                          type="button"
                          title="Increase quantity"
                          aria-label="Increase quantity"
                          onClick={() => setQty(product.id, qty + 1)}
                          disabled={qty >= product.stock}
                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-30"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Subtotal</div>
                        <div className="text-3xl font-black text-foreground tracking-tighter">{formatIDR(lineTotal)}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mt-1">{formatIDR(price)} / unit</div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      title="Remove from cart"
                      aria-label="Remove from cart"
                      onClick={() => removeItem(product.id)}
                      className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white dark:bg-black border border-white/20 flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all shadow-xl z-20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
            
            <div className="flex items-center justify-between px-4">
                <button 
                  type="button"
                  onClick={() => clearCart()}
                  className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                >
                <Trash2 className="h-4 w-4" /> Clear Shopping Cart
              </button>
              <Link href="/catalog" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors">
                Continue Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="p-10 rounded-[3rem] bg-foreground text-background shadow-glow sticky top-24 space-y-10">
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Payment Summary</div>
                <h2 className="text-4xl font-black tracking-tighter">Total.</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-[10px] font-black uppercase tracking-widest">Order Subtotal</span>
                  <span className="text-lg font-black tracking-tighter">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center opacity-60">
                  <span className="text-[10px] font-black uppercase tracking-widest">Est. Logistics</span>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Calculated at checkout</span>
                </div>
                
                <div className="h-[1px] bg-background/10 my-8" />
                
                <div className="flex justify-between items-end">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Grand Total</div>
                  <div className="text-5xl font-black text-primary tracking-tighter">{formatIDR(subtotal)}</div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/checkout"
                  className="flex h-20 items-center justify-center gap-4 rounded-full bg-primary px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-glow transition-all hover:scale-105 active:scale-95"
                >
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </Link>
<p className="text-[9px] text-center mt-6 uppercase tracking-widest opacity-40 font-bold leading-relaxed">
                  Secure checkout powered by Midtrans.<br/>Authenticity & quality guaranteed.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

