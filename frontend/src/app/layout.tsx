import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Search } from "lucide-react";
import "./globals.css";

import MarketplaceFooter from "@/components/marketplace/MarketplaceFooter";
import LayoutStateHydrator from "@/components/marketplace/LayoutStateHydrator";
import MobileNav from "@/components/marketplace/MobileNav";
import WishlistButton from "@/components/marketplace/WishlistButton";
import CartButton from "@/components/marketplace/CartButton";
import Script from "next/script";

import HeaderAuth from "@/components/marketplace/HeaderAuth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BengkelPro — Sparepart Motor Premium",
    template: "%s | BengkelPro",
  },
  description: "Marketplace spare part motor terlengkap. Temukan produk original, cepat, aman, dan terpercaya.",
  keywords: ["sparepart motor", "sparepart online", "bengkel", "otomotif"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background antialiased">
        <LayoutStateHydrator>
          {/* ── Sticky Header ─────────────────────────────────────── */}
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 px-4 h-14 md:h-16 md:container md:mx-auto md:px-6">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white shadow-glow transition-all duration-300 group-hover:scale-105">
                  <span className="text-sm font-black italic">BP</span>
                </div>
                <div className="leading-none hidden sm:block">
                  <div className="text-base font-black tracking-tight uppercase text-gray-900">
                    BENGKEL<span className="text-primary">PRO</span>
                  </div>
                  <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                    Premium Spares
                  </div>
                </div>
              </Link>

              {/* Search Bar — full width on mobile */}
              <div className="flex-1 relative group mx-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/60 placeholder:text-gray-400"
                  placeholder="Cari produk, part, atau kategori..."
                  aria-label="Search"
                />
              </div>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-6">
                {[
                  { label: "Catalog", href: "/catalog" },
                  { label: "Mesin", href: "/catalog?category_id=1" },
                  { label: "Body Part", href: "/catalog?category_id=2" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:flex items-center gap-2">
                  <WishlistButton />
                  <CartButton />
                </div>
                <HeaderAuth />
                {/* Mobile icons handled by MobileNav */}
                <MobileNav />
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <MarketplaceFooter />
        </LayoutStateHydrator>

        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
