"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";

function getCartCount(items: { productId: number; qty: number }[]) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

const NAV_ITEMS_BASE = [
  { id: "home", href: "/",        label: "Home",     icon: Home        },
  { id: "catalog", href: "/catalog", label: "Katalog",  icon: LayoutGrid  },
  { id: "cart", href: "/cart",    label: "Keranjang",icon: ShoppingCart },
  { id: "wishlist", href: "/wishlist",label: "Wishlist", icon: Heart       },
];

export default function MobileNav() {
  const pathname = usePathname();

  const { items, hydrate: hydrateCart } = useCartStore();
  const { productIds, hydrate: hydrateWishlist } = useWishlistStore();
  const { user, isHydrated: isAuthHydrated } = useAuthStore();

  useEffect(() => {
    hydrateCart();
    hydrateWishlist();
  }, [hydrateCart, hydrateWishlist]);

  const cartCount = useMemo(() => getCartCount(items), [items]);
  const wishlistCount = productIds.length;

  const navItems = [
    ...NAV_ITEMS_BASE,
    { 
      id: "profile", 
      href: isAuthHydrated && user ? "/profile" : "/login", 
      label: "Profil", 
      icon: User 
    }
  ];

  return (
    <>
      {/* ── Floating Bottom Nav (mobile only) ──────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-[80] md:hidden bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-16 px-2 safe-area-pb">
          {navItems.map(({ id, href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            const count =
              href === "/cart" ? cartCount :
              href === "/wishlist" ? wishlistCount : 0;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl transition-all duration-200",
                  isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary" />
                )}

                <div className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      isActive && "scale-110"
                    )}
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white shadow-glow">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    "text-[9px] font-semibold leading-none tracking-tight",
                    isActive ? "opacity-100" : "opacity-60"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer so content isn't hidden behind bottom nav */}
      <div className="h-16 md:hidden" aria-hidden />
    </>
  );
}
