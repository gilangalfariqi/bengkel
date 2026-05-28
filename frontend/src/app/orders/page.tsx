"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { orderService } from "@/data/services/orderService";
import type { OrderData } from "@/domain/entities/order";
import { formatIDR, formatDateTime } from "@/lib/formatters";

export default function OrderHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrderHistory() as unknown as { data: OrderData[] } | OrderData[];
        const orderList = Array.isArray(response) ? response : (response.data || []);
        setOrders(orderList);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-12">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        
        {/* Back Link */}
        <div className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Kembali
          </button>
          <span>/</span>
          <span className="text-muted-foreground/40">Riwayat Pesanan</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-lg font-black text-foreground tracking-tight">Riwayat Pesanan</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Daftar transaksi pembelian Anda
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="card p-8 flex flex-col items-center justify-center text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-sm font-bold text-foreground">Belum ada pesanan</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
              Anda belum melakukan pemesanan sparepart apapun.
            </p>
            <Link href="/catalog" className="btn btn-primary mt-6">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={`/orders/${order.id}`}
                  className="card p-4 flex items-center justify-between hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(225,29,72,0.05)] transition-all duration-300 group block"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs font-black text-foreground tracking-tight">{order.order_number}</h3>
                        <span className={`badge ${
                          ['completed', 'selesai'].includes(order.status) 
                            ? "badge-green" 
                            : "badge-amber"
                        }`}>
                          {order.status === 'pending' ? 'Menunggu' : order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                        {formatDateTime(order.created_at)}
                      </p>
                      <div className="text-sm font-black text-primary mt-1.5">{formatIDR(order.total_amount)}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
