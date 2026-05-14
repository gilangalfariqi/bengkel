"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

import ProductCard from "@/components/marketplace/ProductCard";
import ProductSkeleton from "@/components/marketplace/ProductSkeleton";
import { useProductStore } from "@/stores/productStore";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: null, name: "All Products" },
  { id: 1, name: "Mesin" },
  { id: 2, name: "Body Part" },
  { id: 3, name: "Kelistrikan" },
  { id: 4, name: "Ban & Velg" },
  { id: 5, name: "Aksesoris" },
];

function CatalogInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, isLoading, fetchProducts } = useProductStore();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get("category") ? parseInt(searchParams.get("category")!) : null
  );

  useEffect(() => {
    fetchProducts({
      q: search,
      category_id: selectedCategory,
    });
  }, [fetchProducts, search, selectedCategory]);

  const updateFilters = (newCategory: number | null) => {
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) params.set("category", newCategory.toString());
    else params.delete("category");
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      {/* Header & Search */}
      <div className="flex flex-col gap-12 mb-20">
        <div className="space-y-4 max-w-2xl">
          <div className="text-xs font-black uppercase tracking-[0.4em] text-primary">Marketplace</div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">Catalog.</h1>
          <p className="text-muted-foreground text-xl leading-relaxed">Explore our curated collection of high-performance spareparts and original components.</p>
        </div>

        <div className="relative max-w-3xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110" />
          <input
            type="text"
            placeholder="Search by part name, brand, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-20 pl-16 pr-8 rounded-[2.5rem] border-2 border-border bg-card/40 backdrop-blur-xl text-xl font-bold outline-none transition-all focus:ring-8 focus:ring-primary/5 focus:border-primary shadow-premium"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="opacity-50">ESC to Clear</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              <SlidersHorizontal className="h-4 w-4" /> Category Filter
            </div>
            <div className="flex flex-wrap lg:flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => updateFilters(cat.id)}
                  className={cn(
                    "px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 text-left relative overflow-hidden group",
                    selectedCategory === cat.id
                      ? "bg-foreground text-background shadow-premium"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1"
                  )}
                >
                  <span className="relative z-10">{cat.name}</span>
                  {selectedCategory === cat.id && (
                    <motion.div layoutId="activeCat" className="absolute inset-0 bg-primary/10 -z-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-4">
            <h4 className="font-black tracking-tight">Need Assistance?</h4>
Can&apos;t find the specific part? Our specialists are ready to help you find the perfect fit.
            <button className="w-full py-3 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-white shadow-glow">Contact Specialist</button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-border/50">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
              Found {products.length} Results
            </div>
            <div className="flex items-center gap-3">
              <button type="button" title="Grid view" aria-label="Grid view" className="p-3 rounded-xl bg-foreground text-background shadow-premium transition-transform hover:scale-105 active:scale-95">
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button type="button" title="List view" aria-label="List view" className="p-3 rounded-xl bg-secondary text-muted-foreground transition-transform hover:scale-105 active:scale-95">
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </motion.div>
            ) : products.length > 0 ? (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center space-y-8"
              >
                <div className="h-24 w-24 rounded-[2rem] bg-secondary flex items-center justify-center text-muted-foreground animate-float">
                  <Search className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">No products found</h3>
We can&apos;t find anything matching your current filters. Try broadening your search.
                </div>
                <button 
                  onClick={() => { setSearch(""); updateFilters(null); }}
                  className="px-8 py-4 rounded-full bg-primary text-[10px] font-black uppercase tracking-widest text-white shadow-glow"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20">Loading catalog...</div>}>
      <CatalogInner />
    </Suspense>
  );
}



