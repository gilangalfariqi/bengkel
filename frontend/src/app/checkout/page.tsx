"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, MapPin, Package, ShieldCheck, ArrowRight, CreditCard, Truck } from "lucide-react";

import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";
import { orderService } from "@/services/orderService";
import { cartService } from "@/services/cartService";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    snap: {
      pay: (snapToken: string, callbacks: {
        onSuccess: (result: MidtransSnapCallbackResult) => void;
        onPending?: (result: MidtransSnapCallbackResult) => void;
        onError?: (result: MidtransSnapCallbackResult) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

type MidtransSnapCallbackResult = {
  payment_type?: string;
  status?: string;
  [key: string]: unknown;
};

function formatIDR(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

export default function CheckoutPage() {
  const { items, hydrate, clearCart } = useCartStore();
  const { products, fetchProducts, isLoading } = useProductStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
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
    zip: "",
    detail: "",
  });

  const [kurir, setKurir] = useState("jne");
  const [ongkir, setOngkir] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bank_transfer" | "ewallet">("qris");

  async function onEstimateOngkir() {
    setOngkir(24000);
  }

  async function onCreatePayment() {
    if (!hasItems) return;

    const required = [address.name, address.phone, address.province, address.city, address.zip, address.detail];
    if (required.some((v) => !String(v).trim())) {
      alert("Please complete the shipping address form.");
      return;
    }
    if (!ongkir) {
      alert("Please calculate shipping first.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Sync local cart to backend first
      console.log("Starting order creation...");
      console.log("Cart items:", items);
      
      await cartService.syncCart(items);
      console.log("Cart synced successfully");

      console.log("Creating order with data:", {
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

      console.log("Order response:", orderResponse);
      const snapToken = orderResponse.data.payment.snap_token;

      if (window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: (result) => {
            clearCart();
            window.location.href = "/payment/success?method=" + (result.payment_type || "");
          },
          onPending: (result) => {
            clearCart();
            window.location.href = "/payment/success?method=" + (result.payment_type || "");
          },
          onError: (result) => {
            console.error("Payment Error:", result);
            alert("Payment failed. Please try again.");
          },
          onClose: () => {
            alert("You closed the payment popup without finishing payment.");
          }
        });
      } else {
        alert("Midtrans Snap is not loaded. Please refresh the page.");
      }
    } catch (err: unknown) {
      console.error("Order Creation Error:", err);
      const e = err as { message?: string; response?: { data?: { message?: string } } };
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to create order. Please check that the API server is running at " +
          (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000");
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Preparing checkout...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-8 mb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight">Checkout.</h1>
          <p className="text-muted-foreground text-lg">Finalize your order and choose your preferred shipping.</p>
        </div>
      </div>

      {!hasItems ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Nothing to checkout</h2>
            <p className="text-muted-foreground">Your cart is currently empty.</p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-primary px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:scale-105"
          >
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            {/* Shipping Address */}
            <section className="p-8 rounded-[2.5rem] border bg-card shadow-premium">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Shipping Address.</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Recipient Name</label>
                  <input value={address.name} onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))} className="w-full h-14 px-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium" placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Phone Number</label>
                  <input value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} className="w-full h-14 px-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium" placeholder="08xxxxxxxxxx" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Province</label>
                  <input value={address.province} onChange={(e) => setAddress((a) => ({ ...a, province: e.target.value }))} className="w-full h-14 px-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium" placeholder="Province" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">City</label>
                  <input value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} className="w-full h-14 px-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Zip Code</label>
                  <input value={address.zip} onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))} className="w-full h-14 px-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium" placeholder="Postal Code" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Full Address Detail</label>
                  <input value={address.detail} onChange={(e) => setAddress((a) => ({ ...a, detail: e.target.value }))} className="w-full h-14 px-6 rounded-2xl bg-secondary/50 border-transparent outline-none transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary font-medium" placeholder="Street name, house number, apartment, etc." />
                </div>
              </div>
            </section>

            {/* Courier & Shipping */}
            <section className="p-8 rounded-[2.5rem] border bg-card shadow-premium">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Delivery Option.</h2>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { id: "jne", name: "JNE Express" },
                  { id: "jnt", name: "J&T Express" },
                  { id: "sicepat", name: "SiCepat" }
                ].map((k) => (
                  <button
                    key={k.id}
                    onClick={() => setKurir(k.id)}
                    className={cn(
                      "px-8 h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                      kurir === k.id
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {k.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/30">
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estimated Shipping Fee</div>
                  <div className="text-xl font-black">{ongkir ? formatIDR(ongkir) : "Not calculated"}</div>
                </div>
                <button
                  onClick={onEstimateOngkir}
                  className="h-12 px-6 rounded-xl bg-white border text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  Calculate Shipping
                </button>
              </div>
            </section>

            {/* Payment Method */}
            <section className="p-8 rounded-[2.5rem] border bg-card shadow-premium">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Payment Method.</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {([
                  { key: "qris", label: "QRIS Instant" },
                  { key: "bank_transfer", label: "Bank Transfer" },
                  { key: "ewallet", label: "E-Wallet" },
                ] as const).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setPaymentMethod(m.key)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] border transition-all",
                      paymentMethod === m.key
                        ? "bg-primary/5 border-primary text-primary"
                        : "bg-card hover:bg-secondary/50"
                    )}
                  >
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center border-2", paymentMethod === m.key ? "border-primary" : "border-border")}>
                      <div className={cn("h-4 w-4 rounded-full transition-all", paymentMethod === m.key ? "bg-primary scale-100" : "bg-transparent scale-0")} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted and secure payment via Midtrans</span>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="p-8 rounded-[2.5rem] bg-[#0d0d0d] text-white shadow-2xl sticky top-24">
              <h2 className="text-2xl font-black tracking-tight mb-8">Order Summary.</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-white/50 text-xs font-bold uppercase tracking-widest">
                  <span>Items Subtotal</span>
                  <span className="text-white">{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/50 text-xs font-bold uppercase tracking-widest">
                  <span>Shipping Fee</span>
                  <span className="text-white">{ongkir ? formatIDR(ongkir) : "—"}</span>
                </div>
                
                <div className="h-[1px] bg-white/10 my-6" />
                
                <div className="flex justify-between items-end">
                  <div className="text-xs font-bold uppercase tracking-widest text-white/50">Grand Total</div>
                  <div className="text-3xl font-black text-primary">
                    {ongkir ? formatIDR(subtotal + ongkir) : formatIDR(subtotal)}
                  </div>
                </div>
              </div>

              <button
                disabled={isSubmitting || !ongkir}
                onClick={onCreatePayment}
                className="mt-10 w-full h-20 flex items-center justify-center gap-3 rounded-full bg-primary text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 group"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    Confirm Order <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <Link href="/cart" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                  Edit Shopping Cart
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

