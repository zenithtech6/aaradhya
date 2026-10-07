"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/format";
import { normalizeProductCode } from "@/lib/product-code";
import { createClient } from "@/lib/supabase/client";
import { generateOrderId } from "@/lib/whatsapp";
import type { Order, OrderItem, Product } from "@/types";

const inputClass =
  "mt-1 h-11 w-full rounded-lg border border-gold/50 bg-white px-3 text-sm";

export function OrderForm({
  order,
  products,
  onSaved,
}: {
  order?: Order | null;
  products: Product[];
  onSaved?: (saved: Order) => void;
}) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState(order?.customer_name ?? "");
  const [phone, setPhone] = useState(order?.phone ?? "");
  const [address, setAddress] = useState(order?.address ?? "");
  const [pincode, setPincode] = useState(order?.pincode ?? "");
  const [items, setItems] = useState<OrderItem[]>(order?.items ?? []);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const catalog = useMemo(
    () => products.filter((product) => !product.deleted_at),
    [products]
  );

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const codeNeedle = normalizeProductCode(query).toLowerCase();
    return catalog
      .filter((product) => {
        const nameHit = product.name.toLowerCase().includes(needle);
        const codeHit = product.code.toLowerCase().includes(codeNeedle || needle);
        return nameHit || codeHit;
      })
      .slice(0, 8);
  }, [catalog, query]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  function addProduct(product: Product) {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          code: product.code,
          name: product.name,
          image: product.images[0],
          price: product.price,
          qty: 1,
        },
      ];
    });
    setQuery("");
  }

  function addFromQuery() {
    const exact = catalog.find(
      (product) => product.code.toLowerCase() === normalizeProductCode(query).toLowerCase()
    );
    if (exact) {
      addProduct(exact);
      return;
    }
    if (matches.length === 1) {
      addProduct(matches[0]);
      return;
    }
    if (matches.length === 0) {
      toast.error("No product matches that name or code");
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (items.length === 0) {
      toast.error("Add at least one product");
      return;
    }
    setSaving(true);
    const payload = {
      order_id: order?.order_id || generateOrderId(),
      customer_name: customerName,
      phone,
      address,
      pincode,
      items,
      total,
      source: order?.source ?? "manual",
    };
    const supabase = createClient();
    const queryBuilder = order
      ? supabase.from("orders").update(payload).eq("id", order.id).select("*").single()
      : supabase.from("orders").insert(payload).select("*").single();
    const { data, error } = await queryBuilder;
    setSaving(false);
    if (error || !data) {
      toast.error(error?.message || "Could not save order");
      return;
    }
    toast.success("Order saved");
    onSaved?.(data as Order);
    if (!onSaved) {
      router.push("/admin/orders");
      router.refresh();
    }
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-2xl space-y-3">
      <label className="block text-sm">
        Customer name
        <input className={inputClass} value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
      </label>
      <label className="block text-sm">
        Phone
        <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </label>
      <label className="block text-sm">
        Address
        <textarea className={`${inputClass} min-h-20 py-2`} value={address} onChange={(e) => setAddress(e.target.value)} required />
      </label>
      <label className="block text-sm">
        Pincode
        <input className={inputClass} value={pincode} onChange={(e) => setPincode(e.target.value)} required />
      </label>
      <div>
        <label className="block text-sm">
          Add by name or product code
          <input
            className={inputClass}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFromQuery();
              }
            }}
            placeholder="Type DY-CLAY6 or clay diya"
          />
        </label>
        {query.trim() ? (
          <ul className="mt-1 overflow-hidden rounded-lg border border-gold/40 bg-white text-sm">
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-muted-foreground">No matches</li>
            ) : (
              matches.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-[#FFF6E5]"
                    onClick={() => addProduct(product)}
                  >
                    <span>
                      <span className="font-mono text-xs font-semibold">{product.code}</span>
                      {" · "}
                      {product.name}
                      {product.is_hidden ? " (hidden)" : ""}
                    </span>
                    <span>{formatInr(product.price)}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center justify-between rounded-lg border border-gold/40 px-3 py-2 text-sm"
          >
            <span>
              {item.code ? <span className="font-mono text-xs font-semibold">{item.code} · </span> : null}
              {item.name} × {item.qty}
            </span>
            <span className="flex items-center gap-2">
              {formatInr(item.price * item.qty)}
              <button
                type="button"
                className="underline"
                onClick={() =>
                  setItems((prev) =>
                    prev
                      .map((row) =>
                        row.productId === item.productId ? { ...row, qty: row.qty - 1 } : row
                      )
                      .filter((row) => row.qty > 0)
                  )
                }
              >
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>
      <p className="font-semibold">Total: {formatInr(total)}</p>
      <Button className="h-11" disabled={saving}>
        {saving ? "Saving…" : "Save order"}
      </Button>
    </form>
  );
}
