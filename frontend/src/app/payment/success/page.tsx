"use client";

import Link from "next/link";
import { Package, ArrowLeft, ExternalLink, RefreshCw, Home } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = searchParams.get("method") || "WhatsApp";
  
  const oNum = searchParams.get("order_number") || searchParams.get("order_id");
  const tVal = searchParams.get("total");

  const orderId = oNum || "ORD-BNG-PENDING";
  const total = tVal ? Number(tVal) : 0;
  
  const [copied, setCopied] = useState(false);

  const waMessage = encodeURIComponent(`Halo Admin, saya ingin konfirmasi pembayaran untuk pesanan ${orderId} sebesar ${formatIDR(total)}.`);
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_PHONE || "6281234567890";

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090C16] text-[#F8FAFC] flex justify-center md:items-center">
      <div className="w-full max-w-lg bg-[#111625] min-h-screen md:min-h-0 md:rounded-3xl md:shadow-premium md:border md:border-white/5 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-4 h-14 flex items-center border-b border-white/5 shrink-0 bg-slate-950/80 backdrop-blur-xl justify-between">
          <button onClick={() => router.push('/')} className="h-10 w-10 flex items-center justify-center text-white -ml-2 hover:bg-slate-900/60 rounded-xl transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Pemesanan Selesai</span>
          <Link href="/" className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
            <Home className="h-5 w-5" />
          </Link>
        </header>

        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Status Icon */}
            <div className="flex justify-center mt-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 shadow-glow">
                  <Package className="h-12 w-12 text-primary opacity-80" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-[#111625] shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-2xl font-black text-white">Pesanan Berhasil!</h1>
              <p className="text-xs text-slate-400">Terima kasih, pesanan kamu sudah kami terima.</p>
            </div>

            {/* Order Summary Box */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 space-y-4 mb-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nomor Pesanan</div>
                  <div className="text-sm font-black text-white">{orderId}</div>
                </div>
                <div className="flex items-center gap-2">
                  {copied && <span className="text-[10px] text-emerald-400 font-bold">Tersalin</span>}
                  <button 
                    onClick={handleCopyOrderNumber} 
                    className="text-slate-400 hover:text-primary transition p-1 hover:bg-slate-950 rounded" 
                    title="Copy"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Pembayaran</div>
                <div className="text-lg font-black text-primary">{formatIDR(total)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Metode Pembayaran</div>
                <div className="text-sm font-bold text-white capitalize">{method.replace('_', ' ')}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status Pembayaran</div>
                <div className="text-sm font-bold text-amber-500">Menunggu Pembayaran</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pb-6 mt-6">
            <a
              href={`https://wa.me/${adminPhone}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-black uppercase tracking-wider text-white shadow-glow transition hover:bg-primary/90 active:scale-[0.98] cursor-pointer"
            >
              KIRIM BUKTI PEMBAYARAN VIA WA <ExternalLink className="h-4 w-4" />
            </a>

            <Link
              href="/orders"
              className="flex w-full h-12 items-center justify-center rounded-xl border border-white/10 text-white hover:bg-slate-900 text-xs font-black uppercase tracking-wider transition active:scale-[0.98]"
            >
              LIHAT DETAIL PESANAN
            </Link>

            <Link
              href="/catalog"
              className="flex w-full h-12 items-center justify-center rounded-xl text-slate-400 hover:text-white text-xs font-black uppercase tracking-wider transition active:scale-[0.98]"
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
    <Suspense fallback={<div className="min-h-screen bg-[#090C16] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
