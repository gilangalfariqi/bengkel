"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-xl rounded-3xl border bg-background/60 p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-red-600/10 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Pembayaran Gagal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Transaksi belum berhasil diproses. Coba ulang pembayaran atau periksa kembali metode yang dipilih.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/checkout"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Coba Lagi
          </Link>
          <Link
            href="/cart"
            className="inline-flex h-11 items-center justify-center rounded-2xl border bg-background px-5 text-sm font-semibold text-muted-foreground hover:bg-background/80"
          >
            Kembali ke Keranjang
          </Link>
        </div>
      </div>
    </div>
  );
}

