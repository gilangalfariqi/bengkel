"use client";

import { motion } from "framer-motion";
import { Wrench, ArrowRight, ShieldCheck, Truck, Zap } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import CategoryCard from "@/components/marketplace/CategoryCard";
import ProductCard from "@/components/marketplace/ProductCard";
import ProductSkeleton from "@/components/marketplace/ProductSkeleton";
import PromoBanner from "@/components/marketplace/PromoBanner";
import CategoryScroll from "@/components/marketplace/CategoryScroll";

import { useProductStore } from "@/stores/productStore";

const CATEGORY_ITEMS = [
  { title: "Mesin", key: "1", icon: Wrench },
  { title: "Body Part", key: "2", icon: Zap },
  { title: "Kelistrikan", key: "3", icon: Zap },
  { title: "Ban & Velg", key: "4", icon: Zap },
];

export default function Home() {
  const router = useRouter();
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts({ per_page: 10 });
  }, [fetchProducts]);

  const handleCategorySelect = (id: number | null) => {
    if (id) {
      router.push(`/catalog?category_id=${id}`);
    } else {
      router.push(`/catalog`);
    }
  };

  return (
    <div className="flex flex-col pb-32 bg-gray-50 overflow-hidden">
      
      {/* ── Mobile Category Scroll ──────────────────────────────── */}
      <div className="md:hidden bg-white/80 backdrop-blur-xl border-b border-gray-100 pb-1 pt-2 sticky top-14 z-40">
        <CategoryScroll selected={null} onChange={handleCategorySelect} />
      </div>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative w-full flex items-center justify-center pt-12 pb-24 md:py-32 overflow-hidden bg-white">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-rose-50 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 blur-[100px] rounded-full animate-pulse-soft pointer-events-none" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-rose-200/20 blur-[100px] rounded-full animate-float pointer-events-none" />
        
        <div className="container relative z-20 mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Marketplace Sparepart Premium</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight text-gray-900">
              Temukan Part <br/>
              <span className="text-gradient">Terbaik Untukmu.</span>
            </h1>
            
            <p className="max-w-xl mx-auto text-base md:text-lg text-gray-500 leading-relaxed font-medium">
              Koleksi lengkap sparepart motor original dan aftermarket premium. Kualitas terjamin, pengiriman cepat.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/catalog"
                className="group relative flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-10 text-sm font-bold text-white transition-all hover:bg-primary/90 active:scale-95 shadow-glow"
              >
                Mulai Belanja <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            {/* Desktop Stats */}
            <div className="hidden md:flex items-center justify-center gap-12 pt-16">
              {[
                { label: "Produk", val: "12k+" },
                { label: "Brand", val: "450+" },
                { label: "Garansi", val: "100%" },
                { label: "Pengiriman", val: "Cepat" }
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-2xl font-black text-gray-900">{s.val}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Bar ────────────────────────────────────────── */}
      <div className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-30 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: "Kualitas Terjamin", desc: "Semua produk melewati kurasi ketat." },
            { icon: Truck, title: "Pengiriman Cepat", desc: "Langsung kirim di hari yang sama." },
            { icon: Zap, title: "Pasti Pas", desc: "Garansi retur jika tidak cocok." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 md:p-8 rounded-2xl flex items-center md:flex-col md:text-center md:items-center gap-4 border border-gray-100 shadow-premium group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-12 w-12 shrink-0 rounded-xl bg-rose-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{feature.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Desktop Categories (Hidden on Mobile) ───────────────── */}
      <section className="hidden md:block container mx-auto px-4 py-12">
        <div className="flex items-end justify-between gap-8 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">Kategori Pilihan</h2>
            <p className="text-gray-500 mt-2">Temukan part berdasarkan kebutuhan Anda.</p>
          </div>
          <Link href="/catalog" className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            Lihat Semua <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_ITEMS.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CategoryCard
                title={c.title}
                categoryKey={c.key}
                href={`/catalog?category_id=${c.key}`}
                icon={c.icon}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────────── */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between gap-8 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Produk Terbaru</h2>
            <p className="text-sm text-gray-500 mt-1">Koleksi part terbaru untuk upgrade motormu.</p>
          </div>
          <Link href="/catalog" className="hidden md:flex group items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            Lihat Semua <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        
        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden">
          <Link href="/catalog" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 py-3 text-sm font-bold text-gray-900 shadow-sm active:bg-gray-50">
            Lihat Semua Produk <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Promo Banner ────────────────────────────────────────── */}
      <div className="container mx-auto px-4 mt-8">
        <PromoBanner />
      </div>
    </div>
  );
}
