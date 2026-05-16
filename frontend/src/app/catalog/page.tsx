"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, List } from "lucide-react";

import ProductCard from "@/components/marketplace/ProductCard";
import ProductSkeleton from "@/components/marketplace/ProductSkeleton";
import CategoryScroll from "@/components/marketplace/CategoryScroll";
import HelpCard from "@/components/marketplace/HelpCard";
import { useProductStore } from "@/stores/productStore";
import { cn } from "@/lib/utils";

function CatalogInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, isLoading, fetchProducts } = useProductStore();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get("category_id") ? parseInt(searchParams.get("category_id")!) : null
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchProducts({
      q: search,
      category_id: selectedCategory,
    });
  }, [fetchProducts, search, selectedCategory]);

  const updateFilters = (newCategory: number | null) => {
    setSelectedCategory(newCategory);
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) params.set("category_id", newCategory.toString());
    else params.delete("category_id");
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* ── Mobile Category Scroll ──────────────────────────────── */}
      <div className="md:hidden sticky top-14 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 pb-1 pt-2">
        <CategoryScroll selected={selectedCategory} onChange={updateFilters} />
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── Desktop Sidebar Filters ─────────────────────────── */}
          <aside className="hidden md:block w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Kategori</h3>
              <div className="space-y-1">
                {[{ id: null, name: "Semua Kategori" }, { id: 1, name: "Mesin" }, { id: 2, name: "Body Part" }, { id: 3, name: "Kelistrikan" }, { id: 4, name: "Ban & Velg" }, { id: 5, name: "Aksesoris" }].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => updateFilters(cat.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                      selectedCategory === cat.id
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <HelpCard />
          </aside>

          {/* ── Main Content ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Help Card on Mobile */}
            <div className="md:hidden mb-6">
              <HelpCard />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm font-bold text-gray-900">
                Ditemukan {products.length} Produk
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-lg transition-colors border",
                    viewMode === "grid" ? "bg-white text-primary border-primary shadow-sm" : "bg-transparent text-gray-400 border-transparent hover:text-gray-600"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-lg transition-colors border hidden sm:flex",
                    viewMode === "list" ? "bg-white text-primary border-primary shadow-sm" : "bg-transparent text-gray-400 border-transparent hover:text-gray-600"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "grid gap-4",
                    viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                  )}
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
                  className={cn(
                    "grid gap-4",
                    viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                  )}
                >
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                >
                  <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Search className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Produk tidak ditemukan</h3>
                    <p className="text-sm text-gray-500">Coba ubah filter atau kata kunci pencarian Anda.</p>
                  </div>
                  <button
                    onClick={() => { setSearch(""); updateFilters(null); }}
                    className="px-6 py-2.5 rounded-xl bg-primary text-xs font-bold uppercase tracking-wide text-white shadow-glow"
                  >
                    Reset Filter
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 animate-pulse">Loading catalog...</div>}>
      <CatalogInner />
    </Suspense>
  );
}
