import { redirect } from "next/navigation";

/**
 * Payment page removed — gateway payment flow has been replaced
 * by WhatsApp checkout. Redirect all traffic to /checkout.
 */
export default function PaymentPage() {
  redirect("/checkout");
}
