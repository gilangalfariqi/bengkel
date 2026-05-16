"use client";

import Link from "next/link";
import { Package, ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = searchParams.get("method") || "Transfer Bank";
  
  // Generating a fake order ID for the success page visual (since we might not have it in URL)
  const [orderId, setOrderId] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Generate a random ID for visual purposes matching the design "BNG-250518-001"
    const date = new Date();
    const dStr = `${date.getDate().toString().padStart(2, '0')}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getFullYear().toString().slice(2)}`;
    const randomSeq = Math.floor(Math.random() * 900) + 100;
    setOrderId(`#BNG-${dStr}-${randomSeq}`);
    
    // Total is usually passed or fetched. We mock it for the visual if not available
    setTotal(729558); 
  }, []);

  const waMessage = encodeURIComponent(`Halo Admin, saya ingin konfirmasi dan mengirimkan bukti pembayaran untuk pesanan ${orderId} dengan metode ${method}.`);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center md:items-center">
      <div className="w-full max-w-lg bg-white min-h-screen md:min-h-0 md:rounded-3xl md:shadow-sm md:border md:border-gray-100 flex flex-col">
        {/* Header */}
        <header className="px-4 h-14 flex items-center border-b border-gray-100 shrink-0">
          <button onClick={() => router.push('/')} className="h-10 w-10 flex items-center justify-center text-gray-900 -ml-2">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 p-6 flex flex-col">
          {/* Status Icon */}
          <div className="flex justify-center mt-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center">
                <Package className="h-12 w-12 text-primary opacity-50" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-black text-gray-900">Pesanan Berhasil!</h1>
            <p className="text-sm text-gray-500">Terima kasih, pesanan kamu sudah kami terima.</p>
          </div>

          {/* Order Summary Box */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4 mb-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nomor Pesanan</div>
                <div className="text-sm font-black text-gray-900">{orderId}</div>
              </div>
              <button className="text-gray-400 hover:text-primary transition" title="Copy">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Pembayaran</div>
              <div className="text-lg font-black text-primary">{formatIDR(total)}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Metode Pembayaran</div>
              <div className="text-sm font-bold text-gray-900 capitalize">{method.replace('_', ' ')}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status Pembayaran</div>
              <div className="text-sm font-bold text-amber-500">Menunggu Pembayaran</div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto space-y-3 pb-6">
            <a
              href={`https://wa.me/6281234567890?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-glow transition hover:bg-primary/90 active:scale-[0.98]"
            >
              KIRIM BUKTI PEMBAYARAN <ExternalLink className="h-4 w-4" />
            </a>

            <Link
              href="/orders"
              className="flex w-full h-12 items-center justify-center rounded-xl border-2 border-primary text-primary text-sm font-bold hover:bg-rose-50 transition active:scale-[0.98]"
            >
              LIHAT DETAIL PESANAN
            </Link>

            <Link
              href="/catalog"
              className="flex w-full h-12 items-center justify-center rounded-xl text-gray-500 text-sm font-bold hover:bg-gray-50 transition active:scale-[0.98]"
            >
              LANJUT BELANJA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
