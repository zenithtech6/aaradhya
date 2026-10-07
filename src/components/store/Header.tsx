"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { ShopLogo } from "@/components/store/ShopLogo";
import { computeTotals, useCart } from "@/store/cart";

export function Header({
  shopName,
  logoUrl,
}: {
  shopName?: string;
  logoUrl?: string;
}) {
  const items = useCart((state) => state.items);
  const drawerOpen = useCart((state) => state.drawerOpen);
  const openDrawer = useCart((state) => state.openDrawer);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const count = ready ? computeTotals(items).itemCount : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-maroon text-cream">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl tracking-wide">
          <ShopLogo src={logoUrl} name={shopName} className="h-9 w-9 bg-cream/10 p-0.5" />
          <span className="truncate">{shopName || "Diya Store"}</span>
        </Link>
        <button
          type="button"
          onClick={openDrawer}
          className="relative inline-flex size-11 items-center justify-center rounded-full text-gold"
          aria-label={count > 0 ? `Open cart, ${count} items` : "Open cart"}
          aria-expanded={drawerOpen}
          aria-controls="cart-drawer"
        >
          <ShoppingBag className="size-5" aria-hidden="true" />
          {count > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 min-w-5 rounded-full bg-gold px-1 text-[11px] font-semibold text-maroon">
              {count}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
