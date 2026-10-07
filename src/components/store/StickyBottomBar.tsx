"use client";

import { MessageCircle, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { computeTotals, useCart } from "@/store/cart";

export function StickyBottomBar({ whatsappNumber }: { whatsappNumber?: string }) {
  const items = useCart((state) => state.items);
  const openDrawer = useCart((state) => state.openDrawer);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const count = ready ? computeTotals(items).itemCount : 0;
  const wa = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, "Hi, I would like to order diyas.")
    : null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-cream/95 p-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={openDrawer}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-maroon text-sm font-medium text-cream"
        >
          <ShoppingBag className="size-4" />
          Cart{count > 0 ? ` (${count})` : ""}
        </button>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order on WhatsApp"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-medium text-white"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        ) : (
          <span className="inline-flex h-12 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
            WhatsApp
          </span>
        )}
      </div>
    </div>
  );
}
