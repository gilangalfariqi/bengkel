"use client";

import Link from "next/link";

export default function MarketplaceFooter() {

  return (
    <footer className="border-t bg-background/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-sm">
                BP
              </div>
              <div>
                <div className="text-sm font-semibold">Bengkel Spare Parts</div>
                <div className="text-xs text-muted-foreground">Motor parts marketplace</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Belanja sparepart motor lebih cepat, aman, dan terpercaya.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Navigasi</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/catalog">
                  Katalog
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/catalog">
                  Promosi
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Keamanan</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Pembayaran aman</li>
              <li>✓ Proteksi transaksi</li>
              <li>✓ Verifikasi vendor</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Pengiriman</div>
            <div className="grid grid-cols-2 gap-2">
              {["RajaOngkir", "JNE", "J&T", "SiCepat"].map((s) => (
                <div key={s} className="rounded-2xl border bg-background/60 px-3 py-2 text-xs font-semibold text-muted-foreground">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bengkel Spare Parts. All rights reserved.
          </div>
          <div className="text-xs text-muted-foreground">Built for demo & production-ready scaffolding</div>
        </div>
      </div>
    </footer>
  );
}

