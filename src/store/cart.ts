"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

export type { CartItem };

export type CartTotals = {
  itemCount: number;
  subtotal: number;
};

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  lastOrderId: string | null;
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  remove: (productId: string, color?: string, pack?: string) => void;
  update: (
    productId: string,
    qty: number,
    color?: string,
    pack?: string
  ) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setLastOrderId: (orderId: string | null) => void;
  totals: () => CartTotals;
};

function cartKey(item: {
  productId: string;
  color?: string;
  pack?: string;
}): string {
  return `${item.productId}::${item.color ?? ""}::${item.pack ?? ""}`;
}

export function computeTotals(items: CartItem[]): CartTotals {
  return {
    itemCount: items.reduce((sum, item) => sum + item.qty, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.qty, 0),
  };
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,
      lastOrderId: null,
      add: (item) => {
        const qty = item.qty ?? 1;
        const key = cartKey(item);
        set((state) => {
          const existing = state.items.find((row) => cartKey(row) === key);
          if (existing) {
            return {
              lastOrderId: null,
              items: state.items.map((row) =>
                cartKey(row) === key ? { ...row, qty: row.qty + qty } : row
              ),
            };
          }
          return {
            items: [...state.items, { ...item, qty }],
            lastOrderId: null,
          };
        });
      },
      remove: (productId, color, pack) => {
        const key = cartKey({ productId, color, pack });
        set((state) => ({
          items: state.items.filter((row) => cartKey(row) !== key),
        }));
      },
      update: (productId, qty, color, pack) => {
        const key = cartKey({ productId, color, pack });
        if (qty <= 0) {
          get().remove(productId, color, pack);
          return;
        }
        set((state) => ({
          items: state.items.map((row) =>
            cartKey(row) === key ? { ...row, qty } : row
          ),
        }));
      },
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      setLastOrderId: (orderId) => set({ lastOrderId: orderId }),
      totals: () => computeTotals(get().items),
    }),
    {
      name: "diya-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
