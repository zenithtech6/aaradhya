"use client";

import { useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import { BillDocument } from "@/components/admin/BillDocument";
import { OrderForm } from "@/components/admin/OrderForm";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/format";
import type { Order, Product, Settings } from "@/types";

export function BillsClient({
  orders,
  products,
  settings,
  initialOrderId,
}: {
  orders: Order[];
  products: Product[];
  settings: Settings | null;
  initialOrderId?: string;
}) {
  const [selectedId, setSelectedId] = useState(initialOrderId || orders[0]?.id || "");
  const [created, setCreated] = useState<Order | null>(null);
  const selected = useMemo(
    () => created || orders.find((order) => order.id === selectedId) || null,
    [created, orders, selectedId]
  );

  async function download() {
    if (!selected || !settings) {
      toast.error("Pick an order first");
      return;
    }
    const blob = await pdf(<BillDocument order={selected} settings={settings} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selected.order_id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-heading text-xl text-maroon">Pick an order</h2>
        <select
          className="mt-2 h-11 w-full max-w-md rounded-lg border border-gold/50 bg-white px-3 text-sm"
          value={selectedId}
          onChange={(e) => {
            setCreated(null);
            setSelectedId(e.target.value);
          }}
        >
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.order_id} · {order.customer_name} · {formatInr(order.total)}
            </option>
          ))}
        </select>
        {selected ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {selected.customer_name} · {selected.phone} · {formatInr(selected.total)}
          </p>
        ) : null}
        <Button className="mt-4 h-11" onClick={download}>
          Download bill
        </Button>
      </section>
      <section>
        <h2 className="font-heading text-xl text-maroon">Or create an order and bill it</h2>
        <OrderForm products={products} onSaved={setCreated} />
      </section>
    </div>
  );
}
