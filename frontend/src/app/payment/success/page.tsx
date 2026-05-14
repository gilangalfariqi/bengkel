"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const method = searchParams.get("method");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-xl rounded-3xl border bg-background/60 p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Pembayaran Berhasil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pesanan kamu sedang diproses. Notifikasi admin via WhatsApp akan dikirim setelah backend menerima webhook.
        </p>

        <div className="mt-5 rounded-2xl bg-background px-4 py-3 text-xs text-muted-foreground">
          Metode: <span className="font-semibold text-foreground">{method ?? "—"}</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/catalog"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            Lanjut Belanja
          </Link>
          <Link
            href="/dashboard/orders"
            className="inline-flex h-11 items-center justify-center rounded-2xl border bg-background px-5 text-sm font-semibold text-muted-foreground hover:bg-background/80"
          >
            Lihat Riwayat Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

