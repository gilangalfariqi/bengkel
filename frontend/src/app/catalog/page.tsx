"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, List, SlidersHorizontal, X, MessageCircle } from "lucide-react";

import ProductCard from "@/presentation/components/product/ProductCard";
import ProductSkeleton from "@/presentation/components/product/ProductSkeleton";
import CategoryScroll from "@/presentation/components/product/CategoryScroll";
import EmptyState from "@/presentation/components/ui/EmptyState";
import { useProductStore } from "@/presentation/stores/productStore";
import { useDebounce } from "@/presentation/hooks/useDebounce";
import { cn } from "@/lib/utils";

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_PHONE || "6281234567890";

const CATEGORIES = [
  { id: null, name: "Semua Kategori" },
  { id: 1,    name: "Mesin" },
  { id: 2,    name: "Body Part" },
  { id: 3,    name: "Kelistrikan" },
  { id: 4,    name: "Ban & Velg" },
  { id: 5,    name: "Aksesoris" },
  { id: 6,    name: "Oli & Cairan" },
];

const SORT_OPTIONS = [
  { value: "",             label: "Terbaru" },
  { value: "price_asc",   label: "Termurah" },
  { value: "price_desc",  label: "Termahal" },
];

function CatalogInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, isLoading, fetchProducts } = useProductStore();

  const selectedCategory = searchParams.get("category_id")
    ? parseInt(searchParams.get("category_id")!)
    : null;
  const initialQuery = searchParams.get("q") ?? "";
  const initialSort = searchParams.get("sort") ?? "";

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    fetchProducts({
      q: debouncedSearch || undefined,
      category_id: selectedCategory ?? undefined,
      sort: sort || undefined,
    });
  }, [fetchProducts, debouncedSearch, selectedCategory, sort]);

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  };

  const clearSearch = () => {
    setSearchInput("");
    updateUrl({ q: null });
  };

  const resetAll = () => {
    setSearchInput("");
    setSort("");
    router.push("/catalog", { scroll: false });
  };

  const hasActiveFilters = !!selectedCategory || !!debouncedSearch || !!sort;

  return (
    <div className="relative min-h-screen bg-background pb-24 text-foreground">
      {/* ── Ambient bg ── */}
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-96 h-64 bg-primary/4 rounded-full blur-[80px]" />

      {/* ── Mobile Category Scroll ───────────────────────────── */}
      <div className="md:hidden sticky top-14 z-40 bg-surface-overlay backdrop-blur-xl border-b border-border/50">
        <CategoryScroll
          selected={selectedCategory}
          onChange={(id) => updateUrl({ category_id: id?.toString() ?? null })}
        />
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar (desktop) ────────────────────────────── */}
          <aside className="hidden md:block w-60 shrink-0 space-y-4">
            {/* Categories */}
            <div className="card p-5">
              <h3 className="section-eyebrow mb-4">Kategori</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => updateUrl({ category_id: cat.id?.toString() ?? null })}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                      selectedCategory === cat.id
                        ? "bg-primary text-white shadow-glow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* WA Help */}
            <div className="card p-5 space-y-3">
              <h3 className="section-eyebrow">Butuh Bantuan?</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tidak menemukan part yang dicari? Tanya langsung ke tim kami.
              </p>
              <a
                href={`https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent("Halo, saya mencari sparepart untuk motor saya.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat via WhatsApp
              </a>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full h-10 rounded-xl border bg-card text-foreground text-sm pl-9 pr-9 outline-none border-border transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  placeholder="Cari produk atau brand..."
                  aria-label="Cari produk"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Hapus pencarian"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); updateUrl({ sort: e.target.value || null }); }}
                className="h-10 rounded-xl border border-border bg-card text-foreground text-[11px] font-bold px-3 outline-none focus:border-primary/50 cursor-pointer hidden sm:block"
                aria-label="Urutkan produk"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Mobile filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "sm:hidden btn-icon flex items-center justify-center",
                  hasActiveFilters && "border-primary/40 text-primary",
                )}
                aria-label="Filter"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>

              {/* View toggle */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn("btn-icon flex items-center justify-center", viewMode === "grid" && "bg-primary text-white border-primary")}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn("btn-icon flex items-center justify-center", viewMode === "list" && "bg-primary text-white border-primary")}
                  aria-label="List view"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Mobile filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="sm:hidden overflow-hidden mb-4"
                >
                  <div className="card p-4 space-y-3">
                    <div>
                      <label htmlFor="mobile-sort" className="field-label">Urutkan</label>
                      <select
                        id="mobile-sort"
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); updateUrl({ sort: e.target.value || null }); }}
                        className="field-input"
                        aria-label="Urutkan produk"
                      >
                        {SORT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result count + active filters */}
            <div className="flex items-center justify-between mb-5">
              <div className="text-xs font-bold text-muted-foreground">
                Menampilkan{" "}
                <span className="text-foreground font-black">{isLoading ? "..." : products.length}</span>{" "}
                produk
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAll}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Reset Filter
                </button>
              )}
            </div>

            {/* Product grid/list */}
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "grid gap-3 md:gap-4",
                    viewMode === "grid"
                      ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1",
                  )}
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </motion.div>
              ) : products.length > 0 ? (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "grid gap-3 md:gap-4",
                    viewMode === "grid"
                      ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1",
                  )}
                >
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <EmptyState
                    variant="search"
                    onCta={resetAll}
                    ctaLabel="Reset Filter"
                  />
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
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <CatalogInner />
    </Suspense>
  );
}
