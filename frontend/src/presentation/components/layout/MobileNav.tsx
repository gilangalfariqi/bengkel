"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useCartStore } from "@/presentation/stores/cartStore";
import { useWishlistStore } from "@/presentation/stores/wishlistStore";
import { useAuthStore } from "@/presentation/stores/authStore";

const BASE_ITEMS = [
  { id: "home",    href: "/",        label: "Home",    icon: Home         },
  { id: "catalog", href: "/catalog", label: "Katalog", icon: LayoutGrid   },
  { id: "cart",    href: "/cart",    label: "Keranjang",icon: ShoppingCart },
  { id: "wishlist",href: "/wishlist",label: "Wishlist", icon: Heart        },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { items, hydrate: hydrateCart } = useCartStore();
  const { productIds, hydrate: hydrateWishlist } = useWishlistStore();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    hydrateCart();
    hydrateWishlist();
  }, [hydrateCart, hydrateWishlist]);

  const cartCount = useMemo(
    () => items.reduce((s, i) => s + i.qty, 0),
    [items],
  );
  const wishlistCount = productIds.length;

  const navItems = [
    ...BASE_ITEMS,
    {
      id: "profile",
      href: isHydrated && user ? "/profile" : "/login",
      label: isHydrated && user ? "Profil" : "Masuk",
      icon: User,
    },
  ];

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-[80] md:hidden"
        aria-label="Navigasi utama"
      >
        <div className="mx-3 mb-3 glass rounded-2xl shadow-modal overflow-hidden">
          <div className="flex items-center justify-around h-[3.75rem] px-1">
            {navItems.map(({ id, href, label, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href));
              const count =
                id === "cart"
                  ? cartCount
                  : id === "wishlist"
                    ? wishlistCount
                    : 0;

              return (
                <Link
                  key={id}
                  href={href}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-xl transition-colors duration-200 tap-highlight-none",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-bar"
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-6 rounded-full bg-primary"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={isActive ? 2.5 : 1.75}
                      />
                    </motion.div>
                    {count > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white leading-none"
                      >
                        {count > 9 ? "9+" : count}
                      </motion.span>
                    )}
                  </div>

                  <span
                    className={cn(
                      "text-[9px] font-bold leading-none tracking-tight",
                      isActive ? "opacity-100" : "opacity-50",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="h-[5.25rem] md:hidden" aria-hidden />
    </>
  );
}
