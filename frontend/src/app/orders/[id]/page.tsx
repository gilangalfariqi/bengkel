"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Copy, MapPin, Package, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { orderService } from "@/data/services/orderService";
import type { OrderData, OrderItemData } from "@/domain/entities/order";
import { formatIDR, formatDateTime } from "@/lib/formatters";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrderDetail = async () => {
      try {
        const response = await orderService.getOrderDetail(Number(orderId));
        if (response && typeof response === "object" && "data" in response && response.data) {
          setData(response.data as OrderData);
        } else {
          setData(response as OrderData);
        }
      } catch (err) {
        console.error("Failed to fetch order detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.order_number);
    setCopied(true);
    toast.success("Nomor pesanan disalin");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-xl font-black text-foreground mb-2">Pesanan tidak ditemukan</h2>
        <p className="text-sm text-muted-foreground mb-6">Pemesanan ini mungkin tidak ada atau Anda tidak memiliki akses.</p>
        <button onClick={() => router.push("/orders")} className="btn btn-primary">
          Lihat Riwayat Pesanan
        </button>
      </div>
    );
  }

  const isPending = data.status === 'pending';
  // Mock deadline: 24h from created_at
  const createdDate = new Date(data.created_at);
  createdDate.setDate(createdDate.getDate() + 1);
  const deadlineStr = isPending ? formatDateTime(createdDate.toISOString()) : null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-36 md:pb-12">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        
        {/* Back Link */}
        <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <button
            onClick={() => router.push('/orders')}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Riwayat Pesanan
          </button>
          <span>/</span>
          <span className="text-muted-foreground/40">{data.order_number}</span>
        </div>

        <div className="space-y-4">
          {/* Status Banner */}
          {isPending ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-4"
            >
              <Clock className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <span className="font-black text-amber-300">Menunggu Pembayaran:</span> Mohon konfirmasi pesanan ke admin sebelum <span className="font-bold text-white">{deadlineStr}</span>.
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4"
            >
              <Package className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-200/90 leading-relaxed">
                <span className="font-black text-emerald-300">Pesanan Diproses:</span> Pembayaran Anda telah terkonfirmasi. Kami sedang memproses pesanan Anda.
              </div>
            </motion.div>
          )}

          {/* ── Order info ────────────────────────────────────── */}
          <div className="card p-5 space-y-4">
            <h2 className="section-eyebrow">Informasi Transaksi</h2>
            
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Nomor Pesanan</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{data.order_number}</span>
                  <button 
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-primary p-1 hover:bg-secondary/50 rounded transition-colors" 
                    title="Salin Nomor Pesanan"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Waktu Pemesanan</span>
                <span className="font-medium text-foreground">{formatDateTime(data.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status Transaksi</span>
                <span className={`badge ${isPending ? 'badge-amber' : 'badge-green'}`}>
                  {isPending ? 'Menunggu Konfirmasi' : data.status}
                </span>
              </div>
            </div>
          </div>

          {/* ── Shipping details ─────────────────────────────────── */}
          <div className="card p-5 space-y-4">
            <h2 className="section-eyebrow">Alamat Pengiriman</h2>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-sm font-bold text-foreground leading-none">{data.recipient_name}</h4>
                <p className="text-[11px] text-muted-foreground font-semibold tracking-wide">{data.recipient_phone}</p>
                <div className="text-xs text-muted-foreground leading-relaxed pt-2">
                  <p className="font-medium">{data.address_detail}</p>
                  {data.city && data.province && (
                    <p className="mt-0.5">{data.city}, {data.province} {data.postal_code}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Product List ──────────────────────────────────── */}
          <div className="card p-5 space-y-4">
            <h2 className="section-eyebrow">Rincian Produk</h2>

            <div className="space-y-3">
              {data.items?.map((item: OrderItemData) => (
                <div key={item.id} className="flex gap-3 bg-secondary/30 p-3 rounded-xl border border-border/50">
                  <div className="w-12 h-12 bg-card rounded-lg shrink-0 flex items-center justify-center border border-border text-muted-foreground/40">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h4 className="text-xs font-bold text-foreground line-clamp-1 leading-snug">{item.product?.name || 'Produk'}</h4>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 uppercase tracking-wider">{item.quantity}x item</p>
                  </div>
                  <div className="flex items-center shrink-0">
                    <span className="text-xs font-black text-foreground">{formatIDR(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div className="space-y-2.5 text-sm pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal Produk</span>
                <span className="font-semibold">{formatIDR(Number(data.total_amount) - Number(data.shipping_cost))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkir {data.shipping_cost ? formatIDR(data.shipping_cost) : "Rp 0"}</span>
              </div>
              <div className="divider" />
              <div className="flex justify-between items-center pt-1.5">
                <div>
                  <div className="text-xs font-black text-foreground uppercase tracking-widest">Total Tagihan</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-0.5">*Ongkir dikonfirmasi via WhatsApp</div>
                </div>
                <span className="text-lg font-black text-primary tracking-tight">{formatIDR(data.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── WhatsApp Sticky Action Bar ─────────────────────────── */}
      {isPending && (
        <div className="fixed bottom-[5.25rem] md:bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-6">
          <div className="container mx-auto max-w-2xl">
            <div className="glass rounded-2xl p-3">
              <button 
                onClick={() => {
                  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_PHONE || "6281234567890";
                  const text = `Halo Admin, saya ingin melakukan konfirmasi pembayaran untuk pesanan berikut:

No. Order: *${data.order_number}*
Total Tagihan: *${formatIDR(data.total_amount)}*
Atas Nama: ${data.recipient_name}
Nomor HP: ${data.recipient_phone}

Mohon bantuannya untuk memproses pesanan saya. Terima kasih!`;
                  const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
                  window.open(waUrl, "_blank", "noopener,noreferrer");
                }}
                className="w-full flex h-12 items-center justify-center gap-2.5 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-white shadow-glow hover:shadow-[0_0_24px_rgba(225,29,72,0.4)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.887-6.968C16.58 1.93 14.113.905 11.49.905c-5.44 0-9.863 4.422-9.867 9.854-.001 1.764.467 3.487 1.355 5.011L1.871 21.5l5.962-1.562l-.186.216z"/>
                </svg>
                Konfirmasi via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
