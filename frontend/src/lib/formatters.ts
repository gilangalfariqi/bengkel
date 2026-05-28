// ── Centralized formatters — no more inline duplicates ──────────────────────

/** Format number to Indonesian Rupiah: Rp 1.250.000 */
export function formatIDR(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

/** Format compact number: 1.2k, 8k+ */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

/** Resolve image path from backend into a full URL */
export function getImageUrl(imagePath: string | null | undefined, fallback?: string): string {
  const defaultFallback =
    fallback ??
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80";

  if (!imagePath) return defaultFallback;

  const apiBase = (
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  ).replace(/\/$/, "");

  const path = String(imagePath).trim();

  // Already an absolute URL
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Absolute or relative storage path
  if (path.startsWith("/storage/")) return `${apiBase}${path}`;
  if (path.startsWith("storage/")) return `${apiBase}/${path}`;
  // Absolute path (other)
  if (path.startsWith("/")) return `${apiBase}/${path.replace(/^\/+/, "")}`;
  // Relative path
  return `${apiBase}/storage/${path.replace(/^\/+/, "")}`;
}

/** Indonesian date/time formatter */
export function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Calculate discount percentage */
export function calcDiscountPct(price: number, discountPrice: number): number {
  if (price <= 0) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}
