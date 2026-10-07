import { Suspense } from "react";
import { OrderForm } from "@/components/admin/OrderForm";
import { getAdminProducts } from "@/lib/queries";

export default function NewOrderPage() {
  return (
    <Suspense fallback={<p>Loading form…</p>}>
      <NewOrder />
    </Suspense>
  );
}

async function NewOrder() {
  const products = await getAdminProducts();
  return (
    <div>
      <h1 className="font-heading mb-6 text-3xl text-maroon">Create order</h1>
      <OrderForm products={products} />
    </div>
  );
}
