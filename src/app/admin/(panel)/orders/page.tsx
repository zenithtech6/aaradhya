import Link from "next/link";
import { Suspense } from "react";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { getOrders } from "@/lib/queries";

export default function OrdersPage() {
  return (
    <Suspense fallback={<p>Loading orders…</p>}>
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  const orders = await getOrders();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-maroon">Orders</h1>
        <Link href="/admin/orders/new" className="inline-flex h-11 items-center rounded-lg bg-[#4A0E1C] px-4 py-2 text-[#FFF6E5]">
          Create order
        </Link>
      </div>
      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
