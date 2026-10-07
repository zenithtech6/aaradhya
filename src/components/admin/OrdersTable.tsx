"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatInr } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return orders;
    return orders.filter(
      (order) =>
        order.order_id.toLowerCase().includes(needle) ||
        (order.phone || "").toLowerCase().includes(needle)
    );
  }, [orders, query]);

  async function remove(id: string) {
    if (!confirm("Delete this order?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Order deleted");
    router.refresh();
  }

  return (
    <div>
      <input
        className="h-11 w-full max-w-sm rounded-lg border border-gold/50 bg-white px-3 text-sm"
        placeholder="Search order id or phone"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/40">
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Source</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.map((order) => (
              <tr key={order.id} className="border-b border-gold/20">
                <td className="py-2 font-medium">{order.order_id}</td>
                <td>{order.customer_name}</td>
                <td>{order.phone}</td>
                <td>{formatInr(order.total)}</td>
                <td>{order.source}</td>
                <td className="space-x-2 text-right">
                  <Link className="underline" href={`/admin/orders/${order.id}`}>
                    View
                  </Link>
                  <Link className="underline" href={`/admin/bills?order=${order.id}`}>
                    Bill
                  </Link>
                  <button type="button" className="text-maroon underline" onClick={() => remove(order.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
