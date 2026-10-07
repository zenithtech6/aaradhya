import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrderForm } from "@/components/admin/OrderForm";
import { formatInr } from "@/lib/format";
import { getAdminProducts, getOrderById } from "@/lib/queries";

export default function OrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<p>Loading order…</p>}>
      <OrderDetail params={params} />
    </Suspense>
  );
}

async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, products] = await Promise.all([getOrderById(id), getAdminProducts()]);
  if (!order) notFound();
  return (
    <div>
      <h1 className="font-heading text-3xl text-maroon">{order.order_id}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {order.source} · {formatInr(order.total)}
      </p>
      <div className="mt-6">
        <OrderForm order={order} products={products} />
      </div>
    </div>
  );
}
