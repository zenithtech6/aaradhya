import { Suspense } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/queries";

export default function NewProductPage() {
  return (
    <Suspense fallback={<p>Loading form…</p>}>
      <NewProduct />
    </Suspense>
  );
}

async function NewProduct() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="font-heading mb-6 text-3xl text-maroon">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
