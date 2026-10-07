"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Copy, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RemoteImage } from "@/components/media/RemoteImage";
import { formatInr, isDeliverable } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { buildWhatsAppMessage, buildWhatsAppUrl, generateOrderId } from "@/lib/whatsapp";
import { computeTotals, useCart } from "@/store/cart";
import type { Settings } from "@/types";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a 10-digit mobile number"),
  address: z.string().trim().min(8, "Please enter your full address"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a 6-digit pincode"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CartPanel({
  settings,
  compact = false,
}: {
  settings: Settings | null;
  compact?: boolean;
}) {
  const items = useCart((state) => state.items);
  const update = useCart((state) => state.update);
  const remove = useCart((state) => state.remove);
  const clear = useCart((state) => state.clear);
  const lastOrderId = useCart((state) => state.lastOrderId);
  const setLastOrderId = useCart((state) => state.setLastOrderId);
  const totals = useMemo(() => computeTotals(items), [items]);
  const [submitting, setSubmitting] = useState(false);
  const [showCall, setShowCall] = useState(false);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: "", phone: "", address: "", pincode: "" },
  });

  const pincode = form.watch("pincode");
  const deliverable =
    pincode.length !== 6 || isDeliverable(pincode, settings?.deliverable_pincodes);

  async function onWhatsApp(values: CheckoutValues) {
    if (!settings?.whatsapp_number) {
      toast.error("WhatsApp number is not set yet.");
      return;
    }
    if (!isDeliverable(values.pincode, settings.deliverable_pincodes)) return;
    if (items.length === 0) return;

    const nextOrderId = generateOrderId();
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("orders").insert({
        order_id: nextOrderId,
        customer_name: values.name,
        phone: values.phone,
        address: values.address,
        pincode: values.pincode,
        items,
        total: totals.subtotal,
        source: "web",
      });
      if (error) {
        toast.error(error.message || "Could not place the order.");
        return;
      }
      const message = buildWhatsAppMessage({
        orderId: nextOrderId,
        customerName: values.name,
        phone: values.phone,
        address: values.address,
        pincode: values.pincode,
        items,
        total: totals.subtotal,
      });
      window.open(
        buildWhatsAppUrl(settings.whatsapp_number, message),
        "_blank",
        "noopener,noreferrer"
      );
      clear();
      setLastOrderId(nextOrderId);
    } finally {
      setSubmitting(false);
    }
  }

  function onCall() {
    const number = settings?.call_number;
    if (!number) {
      toast.error("Call number is not set yet.");
      return;
    }
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    if (mobile) {
      window.location.href = `tel:${number}`;
      return;
    }
    setShowCall(true);
  }

  async function copyNumber() {
    if (!settings?.call_number) return;
    await navigator.clipboard.writeText(settings.call_number);
    toast.success("Number copied");
  }

  if (lastOrderId) {
    return (
      <div className="px-4 py-10 text-center">
        <span className="flame text-5xl" aria-hidden="true" />
        <h2 className="font-heading mt-4 text-3xl text-maroon">Thank you</h2>
        <p className="mt-2 text-sm text-maroon/80">
          Your order <span className="font-semibold">{lastOrderId}</span> is in. We will confirm
          on WhatsApp and deliver within 24 hours. Cash on delivery.
        </p>
        <Link
          href="/"
          onClick={() => setLastOrderId(null)}
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-maroon px-4 text-cream"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-muted-foreground">Your cart is empty.</p>
    );
  }

  return (
    <div className={compact ? "flex h-full flex-col" : "mx-auto max-w-xl px-4 py-6"}>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.color}-${item.pack}`}
            className="flex gap-3 rounded-xl border border-gold/40 bg-card p-2"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
              <RemoteImage src={item.image} alt={item.name} sizes="64px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-maroon">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {[item.code, item.color, item.pack].filter(Boolean).join(" · ")}
              </p>
              <p className="text-sm">{formatInr(item.price * item.qty)}</p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  className="size-7 rounded border border-gold/50"
                  onClick={() => update(item.productId, item.qty - 1, item.color, item.pack)}
                >
                  −
                </button>
                <span className="text-sm">{item.qty}</span>
                <button
                  type="button"
                  className="size-7 rounded border border-gold/50"
                  onClick={() => update(item.productId, item.qty + 1, item.color, item.pack)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="ml-auto text-xs text-maroon underline"
                  onClick={() => remove(item.productId, item.color, item.pack)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right font-semibold">Total: {formatInr(totals.subtotal)}</p>
      <form className="mt-6 space-y-3" onSubmit={form.handleSubmit(onWhatsApp)}>
        <Field label="Name" error={form.formState.errors.name?.message}>
          <input className={inputClass} {...form.register("name")} />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}>
          <input className={inputClass} inputMode="numeric" maxLength={10} {...form.register("phone")} />
        </Field>
        <Field label="Address" error={form.formState.errors.address?.message}>
          <textarea className={`${inputClass} min-h-20`} {...form.register("address")} />
        </Field>
        <Field label="Pincode" error={form.formState.errors.pincode?.message}>
          <input className={inputClass} inputMode="numeric" maxLength={6} {...form.register("pincode")} />
        </Field>
        {!deliverable ? (
          <div className="rounded-xl border border-saffron bg-card p-3 text-sm text-maroon">
            <p>We do not deliver to this pincode yet.</p>
            {settings?.store_address ? (
              <p className="mt-2 whitespace-pre-line">{settings.store_address}</p>
            ) : null}
            {settings?.call_number ? (
              <p className="mt-2">Call us: {settings.call_number}</p>
            ) : null}
          </div>
        ) : null}
        <Button
          type="submit"
          disabled={submitting || !deliverable}
          className="h-11 w-full bg-[#25D366] text-white hover:bg-[#1ebe5b]"
        >
          {submitting ? "Placing order…" : "Order on WhatsApp"}
        </Button>
        <Button type="button" variant="outline" className="h-11 w-full" onClick={onCall}>
          <Phone className="size-4" />
          Call to order
        </Button>
      </form>
      {showCall && settings?.call_number ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon/40 p-4">
          <div className="gold-border w-full max-w-sm rounded-2xl bg-cream p-4">
            <p className="font-heading text-xl text-maroon">Call to order</p>
            <p className="mt-2 text-lg">{settings.call_number}</p>
            <div className="mt-4 flex gap-2">
              <Button className="h-10 flex-1 bg-maroon text-cream" onClick={copyNumber}>
                <Copy className="size-4" />
                Copy
              </Button>
              <Button variant="outline" className="h-10 flex-1" onClick={() => setShowCall(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-maroon">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-gold/50 bg-white px-3 text-base outline-none focus:ring-2 focus:ring-gold/50";
