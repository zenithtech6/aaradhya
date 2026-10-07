import { Suspense } from "react";
import { BillsClient } from "@/components/admin/BillsClient";
import { getAdminProducts, getOrders, getSettings } from "@/lib/queries";

export default function BillsPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading bills…</p>}>
      <BillsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function BillsContent({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const [orders, products, settings] = await Promise.all([
    getOrders(),
    getAdminProducts(),
    getSettings(),
  ]);
  return (
    <div>
      <h1 className="font-heading mb-6 text-3xl text-maroon">Bills</h1>
      <BillsClient
        orders={orders}
        products={products}
        settings={settings}
        initialOrderId={order}
      />
    </div>
  );
}
