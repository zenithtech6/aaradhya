import Link from "next/link";
import { Suspense } from "react";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { getAdminProducts, getCategories } from "@/lib/queries";

export default function ProductsPage() {
  return (
    <Suspense fallback={<p>Loading products…</p>}>
      <ProductsContent />
    </Suspense>
  );
}

async function ProductsContent() {
  const [products, categories] = await Promise.all([getAdminProducts(), getCategories()]);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-maroon">Products</h1>
        <Link href="/admin/products/new" className="inline-flex h-11 items-center rounded-lg bg-[#4A0E1C] px-4 py-2 text-[#FFF6E5]">
          Add product
        </Link>
      </div>
      <div className="mt-6">
        <ProductsTable products={products} categories={categories} />
      </div>
      <CategoryManager categories={categories} products={products} />
    </div>
  );
}
