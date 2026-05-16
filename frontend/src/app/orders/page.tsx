"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { orderService } from "@/services/orderService";

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrderHistory() as any;
        // Assuming response.data is the paginated object or the array directly
        // The laravel standard Resource or pagination returns `data`
        setOrders(response.data || response || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center md:items-start md:pt-10">
      <div className="w-full max-w-lg bg-white min-h-screen md:min-h-0 md:rounded-3xl md:shadow-sm md:border md:border-gray-100 flex flex-col">
        {/* Header */}
        <header className="px-4 h-14 flex items-center border-b border-gray-100 shrink-0 sticky top-0 bg-white z-10 md:rounded-t-3xl">
          <button onClick={() => router.push('/')} className="h-10 w-10 flex items-center justify-center text-gray-900 -ml-2">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-gray-900 ml-2">Riwayat Pesanan</h1>
        </header>

        <div className="flex-1 p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-sm">
              <Package className="h-12 w-12 text-gray-300 mb-4" />
              <p>Belum ada pesanan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{order.order_number}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md capitalize ${
                          ['completed', 'selesai'].includes(order.status) ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {order.status === 'pending' ? 'Menunggu Pembayaran' : order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs font-bold text-gray-500">Total Pembayaran</span>
                        <span className="text-sm font-black text-gray-900">{formatIDR(order.total_amount)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
