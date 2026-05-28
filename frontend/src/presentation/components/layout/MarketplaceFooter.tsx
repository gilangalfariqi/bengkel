"use client";

import Link from "next/link";
import { MessageCircle, ExternalLink, MapPin, Phone } from "lucide-react";

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_PHONE || "6281234567890";
const WA_URL = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent("Halo BengkelPro, saya ingin bertanya mengenai sparepart motor.")}`;

const LINKS = [
  { label: "Katalog Produk", href: "/catalog" },
  { label: "Keranjang", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Profil Saya", href: "/profile" },
];

export default function MarketplaceFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="container mx-auto px-4 max-w-7xl py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center shadow-glow-sm shrink-0">
                <span className="text-xs font-black italic text-white">BP</span>
              </div>
              <div className="leading-none">
                <div className="text-sm font-black tracking-tight uppercase text-foreground">
                  BENGKEL<span className="text-primary">PRO</span>
                </div>
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                  Premium Spares
                </div>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Marketplace sparepart motor terlengkap. Produk original, terpercaya, dan pengiriman cepat ke seluruh Indonesia.
            </p>
            {/* Contact row */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Jl. Workshop Utama No. 1, Jakarta</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="section-eyebrow mb-4">Navigasi</h3>
            <ul className="space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h3 className="section-eyebrow">Pesan via WhatsApp</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Katalog ini diproses via WhatsApp. Chat langsung admin kami untuk pembelian cepat and terpercaya.
            </p>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa inline-flex"
            >
              <MessageCircle className="h-4 w-4" />
              Chat Admin
            </a>

            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon flex"
                aria-label="Instagram"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon flex"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()} BengkelPro. Semua hak dilindungi.
          </p>
          <p className="text-[11px] text-muted-foreground/40">
            Transaksi aman via WhatsApp
          </p>
        </div>
      </div>
    </footer>
  );
}
