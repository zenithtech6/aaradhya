import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories, getProductById } from "@/lib/queries";

export default function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]">) {
  return (
    <Suspense fallback={<p>Loading product…</p>}>
      <EditProduct params={params} />
    </Suspense>
  );
}

async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="font-heading mb-6 text-3xl text-maroon">Edit product</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
