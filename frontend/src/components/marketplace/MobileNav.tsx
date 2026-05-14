"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

function getCartCount(items: { productId: number; qty: number }[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);


  const { items, hydrate: hydrateCart } = useCartStore();
  const { productIds, hydrate: hydrateWishlist } = useWishlistStore();

  useEffect(() => {
    hydrateCart();
    hydrateWishlist();
  }, [hydrateCart, hydrateWishlist]);


  const cartCount = useMemo(() => getCartCount(items), [items]);

  const wishlistCount = productIds.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-background/50 backdrop-blur-xl text-muted-foreground hover:text-primary md:hidden shadow-premium"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-[85vw] max-w-sm glass backdrop-blur-3xl shadow-2xl overflow-y-auto no-scrollbar"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-glow">
                      <span className="text-lg font-black italic">BP</span>
                    </div>
                    <div>
                      <div className="text-lg font-black tracking-tighter uppercase leading-none">BENGKEL<span className="text-primary">PRO</span></div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Premium Experience</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 space-y-10">
                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Main Navigation</div>
                    <nav className="grid gap-3">
                      {[
                        { label: "Home", href: "/" },
                        { label: "Full Catalog", href: "/catalog" },
                        { label: "Latest Parts", href: "/catalog?sort=newest" },
                        { label: "Performance Kit", href: "/catalog?category=mesin" },
                      ].map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between group rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-white"
                        >
                          {link.label}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Your Activity</div>
                    <div className="grid grid-cols-2 gap-4">
                      <Link 
                        href="/cart"
                        onClick={() => setOpen(false)}
                        className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10"
                      >
                        <ShoppingCart className="h-6 w-6 text-primary" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Cart</div>
                          <div className="text-lg font-black">{cartCount} Items</div>
                        </div>
                      </Link>
                      <button 
                        onClick={() => setOpen(false)}
                        className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 text-left"
                      >
                        <Heart className="h-6 w-6 text-primary" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Wishlist</div>
                          <div className="text-lg font-black">{wishlistCount} Saved</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex w-full h-16 items-center justify-center rounded-3xl bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] transition-all hover:bg-primary hover:text-white shadow-premium"
                  >
                    Login to Account
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Nav */}
      <div className="fixed inset-x-4 bottom-6 z-[80] md:hidden">
        <div className="mx-auto w-full max-w-sm rounded-[2.5rem] border border-white/20 bg-background/60 backdrop-blur-2xl shadow-premium p-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex h-14 w-14 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
              <Search className="h-6 w-6" />
            </Link>
            <Link href="/catalog" className="flex h-14 flex-1 items-center justify-center rounded-full bg-foreground text-background mx-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-premium">
              Catalog
            </Link>
            <Link href="/cart" className="flex h-14 w-14 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-glow animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

