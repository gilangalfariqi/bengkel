import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Search } from "lucide-react";
import { Toaster } from "@/presentation/components/ui/sonner";
import "./globals.css";

import MarketplaceFooter from "@/presentation/components/layout/MarketplaceFooter";
import LayoutStateHydrator from "@/presentation/components/layout/LayoutStateHydrator";
import HeaderActions from "@/presentation/components/layout/HeaderActions";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "BengkelPro — Sparepart Motor Premium",
    template: "%s | BengkelPro",
  },
  description:
    "Marketplace sparepart motor terlengkap. Temukan produk original, harga terbaik, dan pesan langsung via WhatsApp. Pengiriman cepat ke seluruh Indonesia.",
  keywords: [
    "sparepart motor",
    "sparepart online",
    "bengkel motor",
    "otomotif",
    "mesin motor",
    "body part motor",
    "ban motor",
    "kelistrikan motor",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "BengkelPro",
    title: "BengkelPro — Sparepart Motor Premium",
    description:
      "Marketplace sparepart motor terlengkap. Pesan via WhatsApp, cepat dan terpercaya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BengkelPro — Sparepart Motor Premium",
    description: "Marketplace sparepart motor terlengkap.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-background antialiased">
        <LayoutStateHydrator>
          {/* ── Header ─────────────────────────────────────────── */}
          <header
            className="sticky top-0 z-50 glass-header"
            role="banner"
          >
            <div className="flex items-center gap-3 px-4 h-14 md:h-[3.75rem] md:container md:mx-auto md:max-w-7xl md:px-6">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 shrink-0 group"
                aria-label="BengkelPro — Halaman utama"
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white shadow-glow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
                  <span className="text-[11px] font-black italic">BP</span>
                </div>
                <div className="leading-none hidden sm:block">
                  <div className="text-sm font-black tracking-tight uppercase text-foreground">
                    BENGKEL<span className="text-primary">PRO</span>
                  </div>
                  <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                    Sparepart Motor
                  </div>
                </div>
              </Link>

              {/* Search bar */}
              <form
                action="/catalog"
                method="get"
                className="flex-1 relative group mx-2"
                role="search"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                <input
                  name="q"
                  type="search"
                  className="w-full h-9 rounded-xl border bg-surface-elevated text-foreground text-sm pl-9 pr-4 outline-none border-border transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/60"
                  placeholder="Cari sparepart, merk, atau kategori..."
                  aria-label="Cari produk"
                />
              </form>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-5" aria-label="Menu desktop">
                <Link
                  href="/catalog"
                  className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors tracking-wide"
                >
                  Katalog
                </Link>
              </nav>

              {/* Action buttons */}
              <HeaderActions />
            </div>
          </header>

          {/* ── Main Content ────────────────────────────────────── */}
          <main className="flex-1" id="main-content">
            {children}
          </main>

          {/* ── Footer ─────────────────────────────────────────── */}
          <MarketplaceFooter />

          {/* ── Toasts ─────────────────────────────────────────── */}
          <Toaster position="bottom-center" theme="dark" />
        </LayoutStateHydrator>
      </body>
    </html>
  );
}
