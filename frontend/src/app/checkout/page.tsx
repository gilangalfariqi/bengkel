"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ShieldCheck, ChevronDown, ChevronUp, Lock, Truck } from "lucide-react";

import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";
import { orderService } from "@/services/orderService";
import { cartService } from "@/services/cartService";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    snap: {
      pay: (snapToken: string, callbacks: {
        onSuccess: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

type PaymentOption = {
  id: string;
  label: string;
  desc: string;
  disabled?: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, hydrate, clearCart } = useCartStore();
  const { products, fetchProducts, isLoading } = useProductStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  useEffect(() => {
    hydrate();
    fetchProducts();
  }, [hydrate, fetchProducts]);

  const cartLines = useMemo(() => {
    return items
      .map((line) => {
        const p = products.find(p => p.id === line.productId);
        if (!p) return null;
        const price = parseFloat(p.discount_price || p.price);
        return { product: p, qty: line.qty, total: price * line.qty };
      })
      .filter(Boolean) as Array<{ product: (typeof products)[number]; qty: number; total: number }>;
  }, [items, products]);

  const subtotal = cartLines.reduce((sum, l) => sum + l.total, 0);
  const hasItems = cartLines.length > 0;

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    kecamatan: "",
    zip: "",
    detail: "",
    isPrimary: true,
  });

  const [kurir, setKurir] = useState("regular");
  const [ongkir, setOngkir] = useState<number>(15000); // Default simulated
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "ewallet" | "credit_card" | "virtual_account" | "cod">("bank_transfer");

  const shippingOptions = [
    { id: "regular", label: "Regular", desc: "2-4 Hari", price: 15000, icon: "/icons/regular.svg" },
    { id: "hemat", label: "Hemat", desc: "3-5 Hari", price: 9000, icon: "/icons/hemat.svg" },
    { id: "instan", label: "Instan", desc: "1-2 Hari", price: 25000, icon: "/icons/instan.svg" },
    { id: "pickup", label: "Ambil di Toko", desc: "Ambil di toko terdekat", price: 0, icon: "/icons/store.svg" },
  ];

  const paymentOptions: PaymentOption[] = [
    { id: "bank_transfer", label: "Transfer Bank", desc: "Bayar melalui bank pilihan" },
    { id: "ewallet", label: "E-Wallet", desc: "OVO, GoPay, Dana, ShopeePay" },
    { id: "credit_card", label: "Kartu Kredit / Debit", desc: "Visa, Mastercard, JCB" },
    { id: "virtual_account", label: "Virtual Account", desc: "BCA, Mandiri, BNI, BRI" },
    { id: "cod", label: "COD (Bayar di Tempat)", desc: "Tidak tersedia untuk produk tertentu", disabled: true },
  ];

  useEffect(() => {
    // Update simulated ongkir when kurir changes
    const selected = shippingOptions.find(o => o.id === kurir);
    if (selected) setOngkir(selected.price);
  }, [kurir]);

  const handleNextStep1 = () => {
    const required = [address.name, address.phone, address.province, address.city, address.zip, address.detail];
    if (required.some((v) => !String(v).trim())) {
      alert("Mohon lengkapi alamat pengiriman.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep2 = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function onCreatePayment() {
    if (!hasItems) return;
    setIsSubmitting(true);
    try {
      await cartService.syncCart(items);
      const orderResponse = await orderService.createOrder({
        shipping_cost: ongkir,
        courier: kurir,
        service: "REG",
        recipient_name: address.name,
        recipient_phone: address.phone,
        province: address.province,
        city: address.city,
        postal_code: address.zip,
        address_detail: address.detail,
        notes: "Order via Web",
      });

      const snapToken = orderResponse.data.payment.snap_token;
      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: (result) => {
            clearCart();
            window.location.href = "/payment/success?method=" + (result.payment_type || paymentMethod);
          },
          onPending: (result) => {
            clearCart();
            window.location.href = "/payment/success?method=" + (result.payment_type || paymentMethod);
          },
          onError: (result) => {
            console.error("Payment Error:", result);
            alert("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: () => {
            alert("Anda menutup jendela pembayaran.");
          }
        });
      } else {
        alert("Sistem pembayaran belum siap. Silakan muat ulang halaman.");
      }
    } catch (err: any) {
      console.error("Order Creation Error:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Gagal membuat pesanan.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasItems && !isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold">Keranjang Kosong</h2>
        <button onClick={() => router.push('/catalog')} className="mt-4 text-primary font-bold">Belanja Sekarang</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      {/* ── App Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm px-4 h-14 flex items-center justify-between max-w-lg mx-auto">
        <button onClick={() => step > 1 ? setStep((s) => (s - 1) as 1|2|3) : router.back()} className="h-10 w-10 flex items-center justify-center text-gray-900 -ml-2">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-bold text-gray-900">Checkout</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="max-w-lg mx-auto bg-white min-h-[calc(100vh-3.5rem)]">
        {/* ── Stepper ─────────────────────────────────────────────── */}
        <div className="px-6 py-6 border-b border-gray-100 relative">
          <div className="flex justify-between relative z-10">
            {/* Line connecting steps */}
            <div className="absolute top-4 left-6 right-6 h-[2px] bg-gray-200 -z-10" />
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors", step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-400")}>1</div>
              <span className={cn("text-[10px] font-bold", step >= 1 ? "text-primary" : "text-gray-400")}>Alamat</span>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors", step >= 2 ? "bg-primary text-white" : "bg-white border-2 border-gray-200 text-gray-400")}>2</div>
              <span className={cn("text-[10px] font-bold", step >= 2 ? "text-primary" : "text-gray-400")}>Pengiriman</span>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors", step >= 3 ? "bg-primary text-white" : "bg-white border-2 border-gray-200 text-gray-400")}>3</div>
              <span className={cn("text-[10px] font-bold", step >= 3 ? "text-primary" : "text-gray-400")}>Pembayaran</span>
            </div>
          </div>
        </div>

        {/* ── STEP 1: ALAMAT ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="p-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 bg-rose-50/50 p-3 rounded-xl border border-rose-100 mb-6">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <p className="text-xs text-gray-700 font-medium leading-tight">
                Belanjaanmu aman! Kami tidak akan membagikan data kamu.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">Alamat Pengiriman</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Nama Penerima</label>
                <input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" placeholder="Nama Lengkap" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Nomor Telepon</label>
                <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" placeholder="08xxxxxxxxxx" type="tel" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Provinsi</label>
                <input value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" placeholder="Pilih Provinsi" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Kota / Kabupaten</label>
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" placeholder="Pilih Kota / Kabupaten" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Kode Pos</label>
                <input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" placeholder="Kode Pos" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Alamat Lengkap</label>
                <textarea value={address.detail} onChange={(e) => setAddress({ ...address, detail: e.target.value })} rows={3} className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none" placeholder="Alamat lengkap, nama jalan, nomor rumah, patokan (opsional)" />
              </div>

              <div className="flex items-center justify-between pt-2 pb-6 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900">Jadikan sebagai alamat utama</span>
                <button 
                  onClick={() => setAddress({...address, isPrimary: !address.isPrimary})}
                  className={cn("w-11 h-6 rounded-full transition-colors relative", address.isPrimary ? "bg-primary" : "bg-gray-200")}
                >
                  <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", address.isPrimary ? "translate-x-6" : "translate-x-1")} />
                </button>
              </div>

              <button onClick={handleNextStep1} className="w-full h-12 rounded-xl bg-primary text-white text-sm font-bold shadow-glow mt-4 active:scale-[0.98] transition-transform">
                LANJUT KE PENGIRIMAN
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: PENGIRIMAN ────────────────────────────────────── */}
        {step === 2 && (
          <div className="p-6 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Metode Pengiriman</h2>
            
            <div className="space-y-3 mb-8">
              {shippingOptions.map((opt) => (
                <div 
                  key={opt.id} 
                  onClick={() => setKurir(opt.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all",
                    kurir === opt.id ? "border-primary bg-rose-50/30" : "border-gray-200 hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Truck className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">{opt.price === 0 ? "Gratis" : formatIDR(opt.price)}</span>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", kurir === opt.id ? "border-primary" : "border-gray-300")}>
                      {kurir === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (Collapsible) */}
            <div className="border border-gray-200 rounded-2xl p-4 mb-8">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Ringkasan Pesanan</h3>
                  <p className="text-xs text-gray-500">{cartLines.length} Produk</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {cartLines.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100 relative">
                        <Image 
                          src={item.product.primary_image?.image_path ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/storage/${item.product.primary_image.image_path}` : "https://images.unsplash.com/photo-1520975693415-35a64c9fc0c8?auto=format&fit=crop&w=800&q=80"}
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {isSummaryExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </div>

              {isSummaryExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  {cartLines.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 line-clamp-1 pr-4">{item.qty}x {item.product.name}</span>
                      <span className="font-semibold text-gray-900 shrink-0">{formatIDR(item.total)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ongkir</span>
                  <span className="font-semibold text-gray-900">{formatIDR(ongkir)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary">{formatIDR(subtotal + ongkir)}</span>
                </div>
              </div>
            </div>

            <button onClick={handleNextStep2} className="w-full h-12 rounded-xl bg-primary text-white text-sm font-bold shadow-glow active:scale-[0.98] transition-transform">
              LANJUT KE PEMBAYARAN
            </button>
          </div>
        )}

        {/* ── STEP 3: PEMBAYARAN ────────────────────────────────────── */}
        {step === 3 && (
          <div className="p-6 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Metode Pembayaran</h2>

            <div className="space-y-3 mb-8">
              {paymentOptions.map((opt) => (
                <div 
                  key={opt.id} 
                  onClick={() => !opt.disabled && setPaymentMethod(opt.id as any)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all",
                    paymentMethod === opt.id ? "border-primary bg-rose-50/30" : "border-gray-200",
                    opt.disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      {/* Using generic icon for simplicity, could map specific icons */}
                      <ShieldCheck className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{opt.label}</div>
                      <div className={cn("text-xs", opt.disabled ? "text-red-500" : "text-gray-500")}>{opt.desc}</div>
                    </div>
                  </div>
                  <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", paymentMethod === opt.id ? "border-primary" : "border-gray-300")}>
                    {paymentMethod === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-2xl p-4 mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartLines.length} Produk)</span>
                  <span className="font-semibold text-gray-900">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ongkir</span>
                  <span className="font-semibold text-gray-900">{formatIDR(ongkir)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Metode Pembayaran</span>
                  <span className="font-semibold text-gray-900">{paymentOptions.find(o => o.id === paymentMethod)?.label}</span>
                </div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-bold text-gray-900">Total Pembayaran</span>
                  <span className="text-lg font-black text-primary">{formatIDR(subtotal + ongkir)}</span>
                </div>
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              onClick={onCreatePayment} 
              className="w-full h-12 rounded-xl bg-primary text-white text-sm font-bold shadow-glow flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-70 disabled:active:scale-100"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
              {isSubmitting ? "MEMPROSES..." : "BUAT PESANAN"}
            </button>
            <p className="text-[10px] text-center text-gray-500 mt-4 leading-relaxed">
              Dengan membuat pesanan, kamu menyetujui<br/>
              <span className="font-bold text-primary">Syarat & Ketentuan</span> yang berlaku.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
