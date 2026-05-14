"use client";

import { motion } from "framer-motion";
import { Wrench, ArrowRight, ShieldCheck, Truck, Zap } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";

import CategoryCard from "@/components/marketplace/CategoryCard";
import ProductCard from "@/components/marketplace/ProductCard";
import ProductSkeleton from "@/components/marketplace/ProductSkeleton";
import PromoBanner from "@/components/marketplace/PromoBanner";

import { useProductStore } from "@/stores/productStore";

const CATEGORY_ITEMS = [
  { title: "Mesin", key: "mesin", icon: Wrench },
  { title: "Body Part", key: "body-part", icon: Zap },
  { title: "Kelistrikan", key: "kelistrikan", icon: Zap },
  { title: "Ban & Velg", key: "ban-velg", icon: Zap },
];

export default function Home() {
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts({ per_page: 8 });
  }, [fetchProducts]);

  return (
    <div className="flex flex-col gap-24 pb-32 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-[#050505]">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full animate-pulse-soft" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-rose-600/10 blur-[120px] rounded-full animate-float" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&w=1920&q=80')" }}
        />
        
        <div className="container relative z-20 mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-2xl shadow-glow"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">The Premium Sparepart Marketplace</span>
            </motion.div>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter text-white">
              BEYOND <span className="text-primary italic inline-block hover:scale-110 transition-transform cursor-default">LIMITS.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 leading-relaxed font-medium">
              High-performance parts for those who demand excellence. 
              Authenticity guaranteed, performance delivered.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link
                href="/catalog"
                className="group relative flex h-16 w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-primary px-12 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-105 active:scale-95 shadow-glow"
              >
                Start Exploring <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#categories"
                className="flex h-16 w-full sm:w-auto items-center justify-center rounded-full border border-white/20 bg-white/5 px-12 text-sm font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl transition-all hover:bg-white/10"
              >
                Categories
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-16 max-w-3xl mx-auto">
              {[
                { label: "Products", val: "12k+" },
                { label: "Brands", val: "450+" },
                { label: "Guarantee", val: "100%" },
                { label: "Delivery", val: "Fast" }
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-3xl font-black text-white tracking-tighter">{s.val}</div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/20"
        >
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-current rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "EXCELLENCE ASSURED", desc: "Every part is vetted for maximum reliability." },
            { icon: Truck, title: "EXPRESS LOGISTICS", desc: "Swift delivery to keep you on the road." },
            { icon: Zap, title: "PRECISION FIT", desc: "Engineered to fit your machine perfectly." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[3rem] flex flex-col gap-6 shadow-premium group hover:border-primary/50 transition-all duration-500 hover:shadow-glow"
            >
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <feature.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section id="categories" className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="text-xs font-black uppercase tracking-[0.4em] text-primary">Department</div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Shop by Category.</h2>
            <p className="text-muted-foreground text-lg">Curated collections for every enthusiast.</p>
          </div>
          <Link href="/catalog" className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors">
            See All Department <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_ITEMS.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CategoryCard
                title={c.title}
                categoryKey={c.key}
                href={`/catalog?category=${c.key}`}
                icon={c.icon}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="text-xs font-black uppercase tracking-[0.4em] text-primary">New Arrivals</div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Featured Parts.</h2>
            <p className="text-muted-foreground text-lg">The latest high-performance additions to our catalog.</p>
          </div>
          <Link href="/catalog" className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors">
            Full Catalog <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <div className="container mx-auto px-4">
        <PromoBanner />
      </div>
    </div>
  );
}


