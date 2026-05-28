"use client";

import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-[#090C16] text-[#F8FAFC] flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#111625] rounded-3xl border border-white/5 p-8 text-center shadow-premium relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-rose-600 to-red-800" />
        
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/25 shadow-[0_0_20px_rgba(239,68,68,0.15)] mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight uppercase">Pembayaran Gagal</h1>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          Transaksi belum berhasil diproses. Coba ulang pembayaran atau periksa kembali metode yang dipilih.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/checkout"
            className="flex h-12 items-center justify-center rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wider shadow-glow hover:bg-primary/90 active:scale-[0.98] transition"
          >
            Coba Lagi
          </Link>
          <Link
            href="/cart"
            className="flex h-11 items-center justify-center rounded-xl border border-white/10 text-slate-300 hover:bg-slate-900/60 text-xs font-black uppercase tracking-wider transition"
          >
            Kembali ke Keranjang
          </Link>
          <Link
            href="/"
            className="flex h-11 items-center justify-center gap-1.5 text-slate-400 hover:text-white text-xs font-bold transition mt-2"
          >
            <Home className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
