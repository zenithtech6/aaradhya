"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { CartPanel } from "@/components/cart/CartPanel";
import { useCart } from "@/store/cart";
import type { Settings } from "@/types";

export function CartDrawer({ settings }: { settings: Settings | null }) {
  const open = useCart((state) => state.drawerOpen);
  const close = useCart((state) => state.closeDrawer);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-50 bg-maroon/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            id="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <div className="flex items-center justify-between border-b border-gold/40 px-4 py-3">
              <h2 id="cart-drawer-title" className="font-heading text-xl text-maroon">
                Your cart
              </h2>
              <div className="flex items-center gap-2">
                <Link href="/cart" onClick={close} className="text-sm underline">
                  Full page
                </Link>
                <button type="button" onClick={close} aria-label="Close" className="rounded-full p-1">
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pb-8">
              <CartPanel settings={settings} compact />
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
