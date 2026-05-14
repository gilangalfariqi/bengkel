"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Heart, ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useProductStore } from "@/stores/productStore";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/marketplace/ProductCard";
import type { Product } from "@/services/productService";

function formatIDR(value: number | string) {

  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
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

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;

    // setLoading is controlled by the async call; avoid setting state synchronously at effect start
    const promise = getProductBySlug(slug);

    promise.then((data) => {
        if (!isMounted) return;
        if (data) {
          setProduct(data.product);
          setRelated(data.related);
        } else {
          setProduct(null);
          setRelated([]);
        }
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    // Ensure loading turns on after the first paint
    queueMicrotask(() => {
      if (isMounted) setLoading(true);
    });

    return () => {
      isMounted = false;
    };
  }, [slug, getProductBySlug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col gap-12">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted animate-pulse rounded-[3rem]" />
          <div className="space-y-6">
            <div className="h-12 w-full bg-muted animate-pulse rounded-lg" />
            <div className="h-6 w-1/2 bg-muted animate-pulse rounded-lg" />
            <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => router.push('/catalog')} className="mt-4 text-primary font-bold">Back to Catalog</button>
      </div>
    );
  }

  const wished = productIds.includes(product.id);
  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const hasDiscount = discountPrice !== null && discountPrice < price;

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/storage/${img.image_path}`)
    : ["https://images.unsplash.com/photo-1520975693415-35a64c9fc0c8?auto=format&fit=crop&w=800&q=80"];

  return (
    <div className="flex flex-col gap-24 pb-32">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-12">
        <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <div className="h-1 w-1 rounded-full bg-border" />
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <div className="h-1 w-1 rounded-full bg-border" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Gallery */}
          <div className="space-y-8 sticky top-32">
            <motion.div 
              layoutId="product-image"
              className="relative aspect-square overflow-hidden rounded-[4rem] border-2 border-border/50 bg-card shadow-premium group"
            >
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              {hasDiscount && (
                <div className="absolute left-10 top-10 z-10 rounded-full premium-gradient px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-glow">
                  Limited Performance Edition
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
            
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar mask-fade-right">
              {images.map((img, i) => (
                <button

                  key={i}
                  type="button"
                  title={`Select image ${i + 1}`}
                  onClick={() => setSelectedImage(i)}
                  className={cn(

                    "relative h-28 w-28 shrink-0 overflow-hidden rounded-[1.5rem] border-4 transition-all duration-500",
                    selectedImage === i 
                      ? "border-primary scale-110 shadow-glow" 
                      : "border-transparent grayscale opacity-40 hover:opacity-100 hover:grayscale-0 hover:scale-105"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="rounded-full bg-primary/10 border border-primary/20 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                  {product.category.name}
                </div>
                <div className="flex items-center gap-2 text-amber-500 py-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs font-black tracking-widest text-foreground ml-2">5.0</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">{product.brand || 'Original Genuine Parts'}</div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-foreground">
                  {product.name}
                </h1>
              </div>
              
              <div className="flex items-baseline gap-6 pt-4">
                <span className="text-6xl font-black text-foreground tracking-tighter">
                  {formatIDR(hasDiscount ? discountPrice! : price)}
                </span>
                {hasDiscount && (
                  <span className="text-2xl font-bold text-muted-foreground line-through opacity-40">
                    {formatIDR(price)}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-10">
              <div className="prose prose-lg text-muted-foreground/80 leading-relaxed font-medium">
                <p>{product.description || "Every component in our collection is engineered for maximum performance and durability. This genuine part ensures your machine operates at its peak efficiency."}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-10 rounded-[3rem] bg-secondary/30 backdrop-blur-md border border-white/10 shadow-premium">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Inventory</div>
                  <div className={cn("text-2xl font-black tracking-tighter", product.stock > 0 ? "text-foreground" : "text-primary")}>
                    {product.stock > 0 ? `${product.stock} Units` : 'Out of Stock'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Origin</div>
                  <div className="text-2xl font-black tracking-tighter">Genuine</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Mass</div>
                  <div className="text-2xl font-black tracking-tighter">{product.weight}g</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-10 pt-4">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex h-20 w-full sm:w-auto items-center rounded-full border-2 border-border bg-card px-3 shadow-premium">
                  <button
                    type="button"
                    title="Decrease quantity"
                    onClick={() => setQty(q => Math.max(1, q - 1))}

                    className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-black transition-all hover:bg-secondary active:scale-90"
                  >
                    -
                  </button>
                  <span className="w-16 text-center text-xl font-black tracking-tighter">{qty}</span>
                  <button
                    type="button"
                    title="Increase quantity"
                    onClick={() => setQty(q => q + 1)}

                    disabled={qty >= product.stock}
                    className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-black transition-all hover:bg-secondary active:scale-90 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => addItem(product.id, qty)}
                  disabled={product.stock <= 0}
                  className="flex-1 w-full flex h-20 items-center justify-center gap-4 rounded-full bg-primary px-10 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-glow transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50"
                >
                  <ShoppingCart className="h-6 w-6" />
                  Elevate Your Machine
                </button>

                  <button
                    type="button"
                    title={wished ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={() => toggle(product.id)}

                  className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all duration-500",
                    wished ? "bg-primary/10 border-primary/20 text-primary shadow-glow" : "bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/20 hover:shadow-premium"
                  )}
                >
                  <Heart className={cn("h-7 w-7 transition-all duration-500", wished && "fill-primary scale-110")} />
                </button>
              </div>

              {/* USP Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 border-t-2 border-border/50">
                {[
                  { icon: ShieldCheck, text: "Certified Quality" },
                  { icon: Truck, text: "Express Global" },
                  { icon: RotateCcw, text: "30-Day Returns" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="space-y-4 max-w-xl">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Discover More</div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">You May Also Like.</h2>
              <p className="text-muted-foreground text-lg">Complementary parts for your build.</p>
            </div>
            <Link href="/catalog" className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors">
              Back to Catalog <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
