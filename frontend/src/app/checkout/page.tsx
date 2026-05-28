"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { useCartStore } from "@/presentation/stores/cartStore";
import { useProductStore } from "@/presentation/stores/productStore";
import { useAuthStore } from "@/presentation/stores/authStore";
import { buildWhatsAppOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { getImageUrl, formatIDR } from "@/lib/formatters";

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_PHONE || "6281234567890";

type FormState = {
  name: string;
  phone: string;
  address: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Nama wajib diisi";
  if (!form.phone.trim()) errors.phone = "Nomor HP wajib diisi";
  else if (!/^[\d\s+\-()]{8,15}$/.test(form.phone.trim()))
    errors.phone = "Format nomor HP tidak valid";
  if (!form.address.trim()) errors.address = "Alamat wajib diisi";
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, hydrate, clearCart } = useCartStore();
  const { products, fetchProducts, isLoading } = useProductStore();
  const { user, isHydrated: isAuthHydrated, hydrate: hydrateAuth } = useAuthStore();

  const [form, setForm] = useState<FormState>({ name: "", phone: "", address: "", notes: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    hydrate();
    fetchProducts();
    hydrateAuth();
  }, [hydrate, fetchProducts, hydrateAuth]);

  useEffect(() => {
    if (isAuthHydrated && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, isAuthHydrated, router]);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name,
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const cartLines = useMemo(() => {
    return items
      .map((line) => {
        const p = products.find((pp) => pp.id === line.productId);
        if (!p) return null;
        const price = parseFloat(p.discount_price || p.price);
        return { product: p, qty: line.qty, lineTotal: price * line.qty, unitPrice: price };
      })
      .filter(Boolean) as Array<{
        product: (typeof products)[number];
        qty: number;
        lineTotal: number;
        unitPrice: number;
      }>;
  }, [items, products]);

  const subtotal = cartLines.reduce((sum, l) => sum + l.lineTotal, 0);

  function setField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cartLines.length === 0) return;

    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderId = `WA-${Date.now().toString(36).toUpperCase()}`;
      const timestamp = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(new Date()) + " WIB";

      const msg = buildWhatsAppOrderMessage({
        orderId,
        timestamp,
        customerName: form.name,
        customerPhone: form.phone,
        address: form.address,
        notes: form.notes,
        grandTotal: formatIDR(subtotal),
        items: cartLines.map((l) => ({
          name: l.product.name,
          qty: l.qty,
          unitPrice: formatIDR(l.unitPrice),
          subtotal: formatIDR(l.lineTotal),
        })),
      });

      const waUrl = buildWhatsAppUrl(ADMIN_PHONE, msg);
      clearCart();
      window.open(waUrl, "_blank", "noopener,noreferrer");
      router.push("/catalog");
    } catch {
      setErrors({ name: "Terjadi kesalahan, coba lagi." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !isAuthHydrated || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cartLines.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col min-h-[50vh] items-center justify-center gap-4 px-4 text-center">
        <ShieldCheck className="h-12 w-12 text-muted-foreground/30" />
        <h2 className="text-lg font-black text-foreground">Keranjang kosong</h2>
        <p className="text-sm text-muted-foreground">Tambahkan produk sebelum checkout.</p>
        <button onClick={() => router.push("/catalog")} className="btn btn-primary">
          Mulai Belanja
        </button>
      </div>
    );
  }

  const isValid = Object.keys(validate(form)).length === 0 && cartLines.length > 0;

  return (
    <div className="min-h-screen bg-background pb-36 md:pb-8">
      {/* Sub-header */}
      <div className="sticky top-14 z-40 glass-header">
        <div className="container mx-auto px-4 max-w-2xl flex items-center gap-3 h-12">
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-black text-foreground tracking-tight">Checkout via WhatsApp</h1>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="container mx-auto px-4 pt-6 max-w-2xl space-y-4">

          {/* WA info banner */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4"
          >
            <MessageCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-200/90">
              <span className="font-black text-emerald-300">Cara kerja:</span> Isi form di bawah → klik tombol → pesan dikirim otomatis ke WhatsApp admin kami.
            </div>
          </motion.div>

          {/* ── Customer form ──────────────────────────────────── */}
          <div className="card p-5 space-y-4">
            <h2 className="section-eyebrow">Data Pemesan</h2>

            {/* Name */}
            <div>
              <label htmlFor="checkout-name" className="field-label">
                Nama Lengkap <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="field-input"
                placeholder="Masukkan nama lengkap Anda"
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="checkout-phone" className="field-label">
                Nomor HP / WhatsApp <span className="text-primary">*</span>
              </label>
              <input
                id="checkout-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                className="field-input"
                placeholder="08xxxxxxxxxx"
              />
              {errors.phone && <p className="field-error">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="checkout-address" className="field-label">
                Alamat Pengiriman <span className="text-primary">*</span>
              </label>
              <textarea
                id="checkout-address"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                className="field-textarea"
                placeholder="Jl. Nama Jalan No. X, Kelurahan, Kecamatan, Kota, Provinsi"
                rows={3}
              />
              {errors.address && <p className="field-error">{errors.address}</p>}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="checkout-notes" className="field-label">
                Catatan <span className="text-muted-foreground/50">(opsional)</span>
              </label>
              <textarea
                id="checkout-notes"
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                className="field-textarea"
                placeholder="Contoh: Tolong hubungi saya sebelum pengiriman"
                rows={2}
              />
            </div>
          </div>

          {/* ── Order Summary ──────────────────────────────────── */}
          <div className="card p-5 space-y-4">
            <h2 className="section-eyebrow">Ringkasan Pesanan</h2>

            <div className="space-y-3">
              {cartLines.map(({ product, qty, lineTotal }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-border bg-secondary/30">
                    <Image
                      src={getImageUrl(product.primary_image?.image_path)}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground line-clamp-1">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {qty} pcs × {formatIDR(parseFloat(product.discount_price || product.price))}
                    </p>
                  </div>
                  <span className="text-sm font-black text-foreground shrink-0">{formatIDR(lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs font-black text-foreground uppercase tracking-widest">Total Produk</div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">*Ongkir dikonfirmasi via WA</div>
              </div>
              <span className="text-xl font-black text-primary">{formatIDR(subtotal)}</span>
            </div>
          </div>

          {/* Form preview / what WA will send */}
          {isValid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="card p-5 border-emerald-500/20 bg-emerald-500/4"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Siap dikirim ke WhatsApp
                </span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><span className="font-bold text-foreground">Nama:</span> {form.name}</p>
                <p><span className="font-bold text-foreground">No HP:</span> {form.phone}</p>
                <p><span className="font-bold text-foreground">Alamat:</span> {form.address}</p>
                <p><span className="font-bold text-foreground">Produk:</span> {cartLines.length} item</p>
                <p><span className="font-bold text-foreground">Total:</span> {formatIDR(subtotal)}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Submit CTA ──────────────────────────────────────── */}
        <div className="fixed bottom-[5.25rem] md:bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-6">
          <div className="container mx-auto max-w-2xl">
            <div className="glass rounded-2xl p-3">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Produk</span>
                <span className="text-base font-black text-primary">{formatIDR(subtotal)}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex h-13 items-center justify-center gap-3 rounded-xl bg-primary text-[11px] font-black uppercase tracking-widest text-white shadow-glow hover:shadow-[0_0_28px_rgba(225,29,72,0.4)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed tap-highlight-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Membuka WhatsApp...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    Pesan via WhatsApp
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
