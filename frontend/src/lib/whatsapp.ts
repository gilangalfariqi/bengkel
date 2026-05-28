// ── WhatsApp message builder — professional Indonesian format ─────────────────

export type WhatsAppCheckoutPayload = {
  orderId: string;
  timestamp: string;
  customerName: string;
  customerPhone: string;
  address: string;
  notes?: string;
  items: Array<{
    name: string;
    qty: number;
    unitPrice: string;
    subtotal: string;
  }>;
  grandTotal: string;
};

function sanitize(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function sanitizeMultiline(value?: string): string {
  if (!value?.trim()) return "-";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .split(/\r?\n/)
    .map((l) => sanitize(l))
    .filter(Boolean)
    .join("\n");
}

/**
 * Build a professional WhatsApp order message.
 * Includes: customer data, product list, total, notes.
 */
export function buildWhatsAppOrderMessage(
  payload: WhatsAppCheckoutPayload,
): string {
  const productLines = payload.items
    .map(
      (item, i) =>
        `${i + 1}. *${sanitize(item.name)}*\n   Qty: ${item.qty} pcs × ${sanitize(item.unitPrice)}\n   Subtotal: *${sanitize(item.subtotal)}*`,
    )
    .join("\n\n");

  return [
    `🛒 *PESANAN BARU — BengkelPro*`,
    `─────────────────────────────`,
    `📋 *No. Order:* ${sanitize(payload.orderId)}`,
    `🕐 *Waktu:* ${sanitize(payload.timestamp)}`,
    `─────────────────────────────`,
    ``,
    `👤 *DATA PEMBELI*`,
    `Nama      : ${sanitize(payload.customerName)}`,
    `No. HP    : ${sanitize(payload.customerPhone)}`,
    `Alamat    : ${sanitizeMultiline(payload.address)}`,
    ``,
    `─────────────────────────────`,
    `🔧 *DETAIL PRODUK*`,
    ``,
    productLines || "-",
    ``,
    `─────────────────────────────`,
    `💰 *TOTAL PRODUK: ${sanitize(payload.grandTotal)}*`,
    `─────────────────────────────`,
    ``,
    `📝 *Catatan:*`,
    sanitizeMultiline(payload.notes),
    ``,
    `Mohon konfirmasi ketersediaan & info ongkir. Terima kasih! 🙏`,
  ].join("\n");
}

/** Build wa.me deep-link URL */
export function buildWhatsAppUrl(phone: string, text: string): string {
  const cleaned = String(phone || "")
    .replace(/\D/g, "")
    .replace(/^0/, "62");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}

/** Build a single-product inquiry link */
export function buildProductInquiryUrl(
  phone: string,
  productName: string,
  productSlug: string,
): string {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://bengkelpro.com";
  const text = [
    `Halo BengkelPro, saya tertarik dengan produk:`,
    ``,
    `*${productName}*`,
    `${origin}/products/${productSlug}`,
    ``,
    `Apakah produk ini tersedia? Mohon info harga & stok terbaru. Terima kasih 🙏`,
  ].join("\n");
  return buildWhatsAppUrl(phone, text);
}
