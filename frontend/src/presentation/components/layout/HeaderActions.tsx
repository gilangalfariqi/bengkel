"use client";

import dynamic from "next/dynamic";

const WishlistButton = dynamic(() => import("./WishlistButton"), { ssr: false });
const CartButton = dynamic(() => import("./CartButton"), { ssr: false });
const HeaderAuth = dynamic(() => import("./HeaderAuth"), { ssr: false });
const MobileNav = dynamic(() => import("./MobileNav"), { ssr: false });

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="hidden sm:flex items-center gap-1.5">
        <WishlistButton />
        <CartButton />
      </div>
      <HeaderAuth />
      <MobileNav />
    </div>
  );
}
