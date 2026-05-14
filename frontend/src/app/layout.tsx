import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Search } from "lucide-react";
import "./globals.css";

import MarketplaceFooter from "@/components/marketplace/MarketplaceFooter";
import LayoutStateHydrator from "@/components/marketplace/LayoutStateHydrator";
import MobileNav from "@/components/marketplace/MobileNav";
import WishlistButton from "@/components/marketplace/WishlistButton";
import CartButton from "@/components/marketplace/CartButton";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bengkel Spare Parts",
    template: "%s | Bengkel Spare Parts",
  },
  description: "Marketplace spare parts motor, aman, cepat, dan terpercaya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LayoutStateHydrator>
          <header className="sticky top-0 z-50 glass transition-all duration-500 hover:bg-background/80">
            <div className="container mx-auto flex h-24 items-center gap-12 px-4">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white shadow-glow transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <span className="text-xl font-black italic">BP</span>
                </div>
                <div className="leading-none">
                  <div className="text-2xl font-black tracking-tighter uppercase">BENGKEL<span className="text-primary italic">PRO</span></div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] mt-1">Premium Spares</div>
                </div>
              </Link>

              <div className="hidden flex-1 items-center max-w-2xl md:flex">
                <div className="relative w-full group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                  <input
                    className="w-full h-14 rounded-2xl border-2 border-border/50 bg-secondary/30 pl-14 pr-6 text-sm font-bold outline-none transition-all focus:ring-8 focus:ring-primary/5 focus:border-primary/50 shadow-premium"
                    placeholder="Search premium spareparts..."
                    aria-label="Search"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                    <span className="px-1 border rounded">⌘</span>
                    <span>K</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <nav className="hidden items-center gap-8 lg:flex">
                  {[
                    { label: "Catalog", href: "/catalog" },
                    { label: "Performance", href: "/catalog?category=mesin" },
                    { label: "Exterior", href: "/catalog?category=body" },
                  ].map((link) => (
                    <Link 
                      key={link.label}
                      href={link.href} 
                      className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                  <div className="hidden sm:flex items-center gap-3">
                    <WishlistButton />
                    <CartButton />
                  </div>
                  
                  <div className="h-8 w-[1px] bg-border/50 mx-2 hidden sm:block" />
                  
                  <Link
                    href="/login"
                    className="hidden sm:flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-[10px] font-black uppercase tracking-[0.3em] text-background transition-all duration-500 hover:bg-primary hover:text-white shadow-premium hover:shadow-glow"
                  >
                    Login
                  </Link>
                  
                  <MobileNav />
                </div>
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
