"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Copy, ChevronRight, MapPin, Package, Loader2 } from "lucide-react";
import { orderService } from "@/services/orderService";

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(date);
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrderDetail = async () => {
      try {
        const response = await orderService.getOrderDetail(Number(orderId)) as any;
        setData(response.data || response);
      } catch (err) {
        console.error("Failed to fetch order detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 flex-col">
        <h2 className="text-xl font-bold text-gray-900">Pesanan tidak ditemukan</h2>
        <button onClick={() => router.back()} className="mt-4 text-primary font-bold">Kembali</button>
      </div>
    );
  }

  const isPending = data.status === 'pending';
  // Mock deadline: usually backend should return payment expiry. We just mock 24h from created_at
  const createdDate = new Date(data.created_at);
  createdDate.setDate(createdDate.getDate() + 1);
  const deadlineStr = isPending ? formatDate(createdDate.toISOString()) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12 flex justify-center md:items-start md:pt-10">
      <div className="w-full max-w-lg bg-white min-h-[calc(100vh-6rem)] md:min-h-0 md:rounded-3xl md:shadow-sm md:border md:border-gray-100 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="px-4 h-14 flex items-center border-b border-gray-100 shrink-0 sticky top-0 bg-white z-10 md:rounded-t-3xl">
          <button onClick={() => router.push('/orders')} className="h-10 w-10 flex items-center justify-center text-gray-900 -ml-2">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-gray-900 ml-2">Detail Pesanan</h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Status Alert */}
          {isPending && (
            <div className="p-4 bg-amber-50 m-4 rounded-2xl flex gap-3 items-start border border-amber-100">
              <div className="mt-0.5 bg-amber-500 text-white rounded-full p-1 shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-700">Menunggu Pembayaran</h3>
                <p className="text-xs text-amber-600 mt-1 leading-relaxed">
                  Selesaikan pembayaran sebelum <br/>
                  <span className="font-bold">{deadlineStr}</span>
                </p>
              </div>
            </div>
          )}

          {!isPending && (
            <div className="p-4 bg-emerald-50 m-4 rounded-2xl flex gap-3 items-start border border-emerald-100">
              <div className="mt-0.5 bg-emerald-500 text-white rounded-full p-1 shrink-0">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-700 capitalize">{data.status}</h3>
                <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                  Pesanan telah dibayar dan sedang diproses.
                </p>
              </div>
            </div>
          )}

          <div className="h-2 bg-gray-50" />

          {/* Order Info */}
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Nomor Pesanan</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{data.order_number}</span>
                <button className="text-gray-400 hover:text-primary transition" title="Salin">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Tanggal Pesanan</span>
              <span className="text-sm font-semibold text-gray-900">{formatDate(data.created_at)}</span>
            </div>
          </div>

          <div className="h-2 bg-gray-50" />

          {/* Shipping Address */}
          <div className="p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Alamat Pengiriman</h3>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <div className="space-y-1 pr-6 flex-1 relative">
                <h4 className="text-sm font-bold text-gray-900">{data.recipient_name}</h4>
                <p className="text-xs text-gray-500">{data.recipient_phone}</p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                  {data.address_detail}<br/>
                  {data.city}, {data.province} {data.postal_code}
                </p>
                <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="h-2 bg-gray-50" />

          {/* Order Summary */}
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900">Ringkasan Pesanan</h3>
              <span className="text-xs text-gray-500">{data.items?.length || 0} Produk</span>
            </div>

            <div className="space-y-4 mb-6">
              {data.items?.map((item: any) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product?.name || 'Produk'}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.quantity}x</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-900">{formatIDR(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">{formatIDR(data.total_amount - data.shipping_cost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ongkir ({data.shipping_courier})</span>
                <span className="font-semibold text-gray-900">{formatIDR(data.shipping_cost)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 mt-2">
                <span className="text-gray-900">Total Pembayaran</span>
                <span className="text-primary">{formatIDR(data.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        {isPending && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-20 md:absolute md:bottom-0">
            <button 
              onClick={() => {
                if (data.payment?.snap_token && window.snap) {
                  window.snap.pay(data.payment.snap_token, {
                    onSuccess: function (result: any) {
                      router.push(`/payment/success?order_id=${data.order_number}`);
                    },
                    onPending: function (result: any) {
                      router.push(`/payment/success?order_id=${data.order_number}`);
                    },
                    onError: function (result: any) {
                      alert("Pembayaran gagal. Silakan coba lagi.");
                    },
                    onClose: function () {
                      // user closed popup
                    }
                  });
                } else {
                  alert("Token pembayaran tidak ditemukan. Silakan hubungi admin.");
                }
              }}
              className="w-full h-12 rounded-xl border-2 border-primary bg-primary text-white text-sm font-bold shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98]"
            >
              BAYAR SEKARANG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
