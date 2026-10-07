import type { Metadata } from "next";
import { Suspense } from "react";
import { CartPanel } from "@/components/cart/CartPanel";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your diyas and order on WhatsApp. Cash on delivery.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3 px-4 py-8" aria-busy="true">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}

async function CartContent() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-heading px-4 pt-6 text-3xl text-maroon">Cart</h1>
      <CartPanel settings={settings} />
    </div>
  );
}
