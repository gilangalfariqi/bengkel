"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart, ShoppingCart, Star, ShieldCheck, Truck,
  RotateCcw, ChevronLeft, MessageCircle, Plus, Minus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useCartStore } from "@/presentation/stores/cartStore";
import { useWishlistStore } from "@/presentation/stores/wishlistStore";
import { useProductStore } from "@/presentation/stores/productStore";
import { cn } from "@/lib/utils";
import ProductCard from "@/presentation/components/product/ProductCard";
import ProductSkeleton from "@/presentation/components/product/ProductSkeleton";
import type { Product } from "@/domain/entities/product";
import { getImageUrl, formatIDR, calcDiscountPct } from "@/lib/formatters";
import { buildProductInquiryUrl } from "@/lib/whatsapp";

const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_PHONE || "6281234567890";

/* ── Skeleton ──────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl animate-shimmer-dark" />
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 w-20 rounded-xl animate-shimmer-dark shrink-0" />
            ))}
          </div>
        </div>
        <div className="space-y-5 pt-4">
          <div className="h-5 w-24 rounded-full animate-shimmer-dark" />
          <div className="h-10 w-full rounded-xl animate-shimmer-dark" />
          <div className="h-10 w-2/3 rounded-xl animate-shimmer-dark" />
          <div className="h-7 w-32 rounded-lg animate-shimmer-dark" />
          <div className="h-24 w-full rounded-xl animate-shimmer-dark" />
          <div className="h-14 w-full rounded-full animate-shimmer-dark" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();

  const { getProductBySlug } = useProductStore();
  const { addItem } = useCartStore();
  const { productIds, toggle } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setLoading(true);

    getProductBySlug(slug).then((data) => {
      if (!mounted) return;
      if (data) {
        setProduct(data.product);
        setRelated(data.related);
      }
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [slug, getProductBySlug]);

  if (loading) return <DetailSkeleton />;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-xl font-black text-foreground mb-2">Produk tidak ditemukan</h2>
        <p className="text-sm text-muted-foreground mb-6">Produk ini mungkin sudah tidak tersedia.</p>
        <button onClick={() => router.push("/catalog")} className="btn btn-primary">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const wished = productIds.includes(product.id);
  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const hasDiscount = discountPrice !== null && discountPrice < price;
  const discountPct = hasDiscount ? calcDiscountPct(price, discountPrice!) : 0;
  const activePrice = hasDiscount ? discountPrice! : price;

  const images = (() => {
    if (product.images && product.images.length > 0) {
      return product.images.map((img) => getImageUrl(img.image_path));
    }
    return [getImageUrl(product.primary_image?.image_path)];
  })();

  const waInquiryUrl = buildProductInquiryUrl(ADMIN_PHONE, product.name, product.slug);

  function handleAddToCart() {
    if (product!.stock <= 0) return;
    addItem(product!.id, qty);
    toast.success(`${qty}x ${product!.name} ditambahkan`, { duration: 2000 });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleWishlist() {
    toggle(product!.id);
    toast(wished ? "Dihapus dari wishlist" : "Disimpan ke wishlist", { duration: 1800 });
  }

  return (
    <>
      <div className="min-h-screen pb-28 md:pb-8">
        {/* ── Breadcrumb ──────────────────────────────────────── */}
        <div className="container mx-auto px-4 pt-5 max-w-7xl">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 hover:text-primary transition-colors"
              aria-label="Kembali"
            >
              <ChevronLeft className="h-3 w-3" />
              Kembali
            </button>
            <span>/</span>
            <Link href="/catalog" className="hover:text-primary transition-colors">Katalog</Link>
            <span>/</span>
            <span className="text-muted-foreground/40 truncate max-w-[140px]">{product.name}</span>
          </nav>
        </div>

        {/* ── Main ────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* ── Gallery ─────────────────────────────────────── */}
            <div className="space-y-3 lg:sticky lg:top-20">
              {/* Main image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={images[selectedImage]}
                      alt={product.name}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Discount badge */}
                {hasDiscount && (
                  <div className="absolute left-3 top-3 z-10 badge badge-solid-red">
                    -{discountPct}%
                  </div>
                )}

                {/* Stock out overlay */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <span className="badge bg-black/80 text-white border border-white/20 text-sm py-2 px-4">
                      Stok Habis
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      aria-label={`Lihat gambar produk ${i + 1}`}
                      title={`Lihat gambar produk ${i + 1}`}
                      className={cn(
                        "relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200",
                        selectedImage === i
                          ? "border-primary scale-105 shadow-glow-sm"
                          : "border-border opacity-50 hover:opacity-80 hover:scale-105",
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Details ─────────────────────────────────────── */}
            <div className="space-y-6">
              {/* Category + Rating */}
              <div className="flex items-center gap-3">
                <span className="badge badge-red">{product.category.name}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="h-3 w-3 fill-amber-400 stroke-none" />)}
                  <span className="text-[10px] font-black text-muted-foreground ml-1">5.0</span>
                </div>
              </div>

              {/* Brand + Name */}
              <div className="space-y-1.5">
                <div className="section-eyebrow">{product.brand ?? "Original Genuine Parts"}</div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-foreground tracking-tight">
                  {formatIDR(activePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-base font-bold text-muted-foreground line-through opacity-50">
                    {formatIDR(price)}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Stok",    value: product.stock > 0 ? `${product.stock} pcs` : "Habis", warn: product.stock <= 0 },
                  { label: "Berat",   value: `${product.weight}g` },
                  { label: "Kondisi", value: "Original" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="card p-3 text-center"
                  >
                    <div className={cn(
                      "text-sm font-black tracking-tight",
                      stat.warn ? "text-primary" : "text-foreground",
                    )}>
                      {stat.value}
                    </div>
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity + Add to cart (desktop) */}
              <div className="hidden md:flex items-center gap-3">
                {/* Qty stepper */}
                <div className="flex items-center gap-2 h-12 bg-card border border-border rounded-full px-2">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary transition-colors active:scale-90"
                    aria-label="Kurangi"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-black">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    disabled={qty >= product.stock}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary transition-colors active:scale-90 disabled:opacity-30"
                    aria-label="Tambah"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add to cart */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  whileTap={{ scale: 0.96 }}
                  animate={addedToCart ? { scale: [1, 1.04, 1] } : {}}
                  className={cn(
                    "flex-1 flex h-12 items-center justify-center gap-2 rounded-full text-[11px] font-black uppercase tracking-widest text-white transition-all duration-200",
                    product.stock > 0
                      ? "bg-primary shadow-glow hover:shadow-[0_0_28px_rgba(225,29,72,0.4)]"
                      : "bg-muted text-muted-foreground cursor-not-allowed",
                  )}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {addedToCart ? "Ditambahkan ✓" : product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  type="button"
                  onClick={handleWishlist}
                  whileTap={{ scale: 0.88 }}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                    wished
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/30",
                  )}
                  aria-label={wished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                >
                  <Heart className={cn("h-5 w-5 transition-all", wished && "fill-primary")} />
                </motion.button>
              </div>

              {/* WA inquiry */}
              <a
                href={waInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-[11px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-glow-green active:scale-95 transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                Tanya Ketersediaan via WhatsApp
              </a>

              {/* USP mini row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                {[
                  { icon: ShieldCheck, text: "Kualitas Terjamin" },
                  { icon: Truck,       text: "Pengiriman Cepat" },
                  { icon: RotateCcw,  text: "Garansi 30 Hari" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center text-center gap-1.5 py-3">
                    <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related products ─────────────────────────────────── */}
        {related.length > 0 && (
          <section aria-label="Produk terkait" className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="flex items-end justify-between mb-6">
              <div className="space-y-1.5">
                <div className="section-eyebrow">Temukan Lebih Banyak</div>
                <h2 className="section-title">Produk Terkait.</h2>
              </div>
              <Link href="/catalog" className="hidden md:flex text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                Semua Produk →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* ── Mobile sticky CTA ───────────────────────────────── */}
      <div className="fixed bottom-[5.25rem] left-0 right-0 z-50 md:hidden px-4 pb-2">
        <div className="glass rounded-2xl p-3 flex items-center gap-3">
          {/* Qty */}
          <div className="flex items-center gap-1.5 bg-card/80 rounded-xl px-2 h-11 border border-border/60">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground active:scale-90 transition-all"
              aria-label="Kurangi"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-black">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              disabled={qty >= product.stock}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground active:scale-90 transition-all disabled:opacity-30"
              aria-label="Tambah"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Add to cart */}
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            whileTap={{ scale: 0.96 }}
            className="flex-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-white shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
          </motion.button>

          {/* Wishlist */}
          <motion.button
            type="button"
            onClick={handleWishlist}
            whileTap={{ scale: 0.85 }}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all",
              wished ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground",
            )}
          >
            <Heart className={cn("h-4.5 w-4.5", wished && "fill-primary")} />
          </motion.button>
        </div>
      </div>
    </>
  );
}
