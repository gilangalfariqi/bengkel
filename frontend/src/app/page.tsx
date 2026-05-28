"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageCircle,
  Wrench,
  CircleDot,
  Gauge,
  Bike,
  Droplets,
  Layers,
} from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";

import ProductCard from "@/presentation/components/product/ProductCard";
import ProductSkeleton from "@/presentation/components/product/ProductSkeleton";
import CategoryScroll from "@/presentation/components/product/CategoryScroll";
import { useProductStore } from "@/presentation/stores/productStore";
import { useRouter } from "next/navigation";

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_PHONE || "6282174128947";
const WA_GENERAL = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent("Halo BengkelPro, saya ingin bertanya mengenai sparepart motor.")}`;

const CATEGORIES = [
  { label: "Mesin",       id: "1", Icon: Wrench,     color: "#E11D48" },
  { label: "Body Part",   id: "2", Icon: Layers,      color: "#3B82F6" },
  { label: "Kelistrikan", id: "3", Icon: Zap,         color: "#F59E0B" },
  { label: "Ban & Velg",  id: "4", Icon: CircleDot,   color: "#10B981" },
  { label: "Aksesoris",   id: "5", Icon: Bike,        color: "#8B5CF6" },
  { label: "Oli & Cairan",id: "6", Icon: Droplets,    color: "#06B6D4" },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "100% Genuine", desc: "Produk tersertifikasi mekanik ahli" },
  { icon: Gauge,        title: "Presisi Fitment", desc: "Garansi kesesuaian komponen" },
  { icon: MessageCircle,title: "Order via WA",  desc: "Respon admin cepat & terpercaya" },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
} as any;

export default function Home() {
  const router = useRouter();
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts({ per_page: 10 });
  }, [fetchProducts]);

  const handleCategorySelect = (id: number | null) => {
    router.push(id ? `/catalog?category_id=${id}` : "/catalog");
  };

  return (
    <div className="relative flex flex-col overflow-hidden bg-background text-foreground">
      {/* ── Ambient background ──────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute top-0 right-[-10%] w-[60vw] h-[50vh] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute top-[50vh] left-[-15%] w-[40vw] h-[40vh] rounded-full bg-blue-600/4 blur-[100px]" />
        <div className="bg-dot-grid absolute inset-0 opacity-30" />
      </div>

      {/* ── Mobile Category Scroll ───────────────────────────── */}
      <div className="md:hidden sticky top-14 z-40 bg-surface-overlay backdrop-blur-xl border-b border-border/50">
        <CategoryScroll selected={null} onChange={handleCategorySelect} />
      </div>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative z-10 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* WA mode banner */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3"
          >
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-emerald-300 font-semibold">
              <span className="font-black">Mode Katalog Aktif</span> — Temukan produk, lalu pesan langsung via WhatsApp. Lebih cepat, lebih personal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
            {/* Left — Copy */}
            <div>
              <motion.div
                variants={stagger}
                initial="initial"
                animate="animate"
                className="space-y-6"
              >
                {/* Eyebrow */}
                <motion.div variants={fadeUp} className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="section-eyebrow">Marketplace Sparepart Motor</span>
                  </div>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={fadeUp}
                  className="text-[2.8rem] sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-[-0.04em] text-foreground"
                >
                  Cari Part.{" "}
                  <br />
                  Pilih Cepat.{" "}
                  <br />
                  <span className="text-gradient">Order via WA.</span>
                </motion.h1>

                {/* Subline */}
                <motion.p
                  variants={fadeUp}
                  className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md font-medium"
                >
                  Katalog sparepart motor terlengkap. Temukan komponen yang tepat, bandingkan harga, dan pesan langsung ke admin — tanpa ribet.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <Link
                    href="/catalog"
                    className="group flex h-14 items-center justify-center gap-2.5 rounded-full bg-primary px-8 text-[11px] font-black uppercase tracking-widest text-white shadow-glow hover:shadow-[0_0_32px_rgba(225,29,72,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-200 tap-highlight-none"
                  >
                    Lihat Katalog
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href={WA_GENERAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 items-center justify-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-8 text-[11px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-glow-green active:scale-95 transition-all duration-200 tap-highlight-none"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Tanya via WhatsApp
                  </a>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  variants={fadeUp}
                  className="hidden sm:flex items-center gap-10 pt-8 border-t border-border/60"
                >
                  {[
                    { val: "8k+",   label: "Produk Tersedia" },
                    { val: "180+",  label: "Brand OEM" },
                    { val: "99.8%", label: "Kepuasan Pelanggan" },
                    { val: "100%",  label: "Garansi Presisi" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-xl font-black text-foreground tracking-tight">{s.val}</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Right — Visual card (desktop only) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-[320px] aspect-square rounded-[2.5rem] border border-border bg-card shadow-modal overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/12 via-transparent to-transparent" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=640&q=80"
                  alt="Sparepart motor premium"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Floating label */}
                <div className="absolute bottom-5 left-5 right-5 glass rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <div className="section-eyebrow">Part Terlaris</div>
                    <div className="text-xs font-black text-foreground mt-0.5">Titanium Exhaust Gen.3</div>
                  </div>
                  <Link
                    href="/catalog?q=titanium"
                    className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-white hover:scale-105 active:scale-90 transition-transform"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ─────────────────────────────────────── */}
      <section aria-label="Keunggulan kami" className="relative z-10 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-3 divide-x divide-border/50">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center py-6 px-4 gap-2.5"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-[11px] font-black text-foreground">{title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug hidden sm:block">{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories (desktop) ────────────────────────────── */}
      <section className="hidden md:block relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <div className="section-eyebrow">Kategori Produk</div>
            <h2 className="section-title">Sistem Kategori Kami.</h2>
          </div>
          <Link
            href="/catalog"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            Semua Kategori <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ label, id, Icon, color }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={`/catalog?category_id=${id}`}
                className="group flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-card/80 hover:-translate-y-1 transition-all duration-250 card-hover"
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${color}18`, border: `1px solid ${color}22` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-foreground leading-snug">
                  {label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────── */}
      <section aria-label="Produk unggulan" className="relative z-10 container mx-auto px-4 pb-16 max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <div className="section-eyebrow">Produk Terbaru</div>
            <h2 className="section-title">Genuine Products.</h2>
          </div>
          <Link
            href="/catalog"
            className="hidden md:flex group items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            Lihat Semua <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
          >
            {products.map((p) => (
              <motion.div key={p.id} variants={fadeUp}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden">
          <Link
            href="/catalog"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-border-strong transition-all"
          >
            Lihat Semua Produk <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── WhatsApp CTA Banner ──────────────────────────────── */}
      <section className="relative z-10 container mx-auto px-4 pb-16 max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border p-8 md:p-14">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/8 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-lg">
              <div className="section-eyebrow">Konsultasi Gratis</div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
                Perlu Bantuan Pilih<br />Sparepart yang Tepat?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tim mekanik senior kami siap membantu — dari memilih part yang cocok hingga konfirmasi ketersediaan stok. Chat langsung, respon cepat.
              </p>
            </div>

            <a
              href={WA_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex h-14 w-full md:w-auto items-center justify-center gap-3 rounded-full bg-primary px-10 text-[11px] font-black uppercase tracking-widest text-white shadow-glow hover:shadow-[0_0_32px_rgba(225,29,72,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-200 tap-highlight-none"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
