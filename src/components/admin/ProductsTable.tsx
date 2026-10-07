"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatInr } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/types";

type Filter = "live" | "hidden" | "deleted";

export function ProductsTable({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("live");
  const names = Object.fromEntries(categories.map((category) => [category.id, category.name]));

  const visible = useMemo(() => {
    if (filter === "deleted") return products.filter((product) => product.deleted_at);
    if (filter === "hidden") {
      return products.filter((product) => !product.deleted_at && product.is_hidden);
    }
    return products.filter((product) => !product.deleted_at && !product.is_hidden);
  }, [products, filter]);

  async function patch(id: string, payload: Partial<Product>, ok: string) {
    const supabase = createClient();
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(ok);
    router.refresh();
  }

  function hide(product: Product) {
    void patch(product.id, { is_hidden: true }, `${product.code} hidden from shop`);
  }

  function unhide(product: Product) {
    void patch(product.id, { is_hidden: false }, `${product.code} visible in shop`);
  }

  function remove(product: Product) {
    if (!confirm(`Soft-delete ${product.code} ${product.name}? You can restore it later.`)) return;
    void patch(product.id, { deleted_at: new Date().toISOString(), is_hidden: true }, "Product moved to deleted");
  }

  function restore(product: Product) {
    void patch(product.id, { deleted_at: null, is_hidden: false }, `${product.code} restored`);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(["live", "hidden", "deleted"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`h-10 rounded-full px-4 text-sm capitalize ${
              filter === tab
                ? "bg-[#4A0E1C] text-[#FFF6E5]"
                : "border border-gold/50 text-[#4A0E1C]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/40">
              <th className="py-2">Code</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td className="py-6 text-muted-foreground" colSpan={6}>
                  No products in this list.
                </td>
              </tr>
            ) : (
              visible.map((product) => (
                <tr key={product.id} className="border-b border-gold/20">
                  <td className="py-2 font-mono text-xs font-semibold">{product.code || "—"}</td>
                  <td className="font-medium">{product.name}</td>
                  <td>{product.category_id ? names[product.category_id] : "—"}</td>
                  <td>{formatInr(product.price)}</td>
                  <td>
                    {product.deleted_at
                      ? "Deleted"
                      : product.is_hidden
                        ? "Hidden"
                        : product.in_stock
                          ? "Live"
                          : "Out of stock"}
                  </td>
                  <td className="space-x-2 whitespace-nowrap text-right">
                    {product.deleted_at ? (
                      <button type="button" className="underline" onClick={() => restore(product)}>
                        Restore
                      </button>
                    ) : (
                      <>
                        <Link className="underline" href={`/admin/products/${product.id}`}>
                          Edit
                        </Link>
                        {product.is_hidden ? (
                          <button type="button" className="underline" onClick={() => unhide(product)}>
                            Show
                          </button>
                        ) : (
                          <button type="button" className="underline" onClick={() => hide(product)}>
                            Hide
                          </button>
                        )}
                        <button
                          type="button"
                          className="text-maroon underline"
                          onClick={() => remove(product)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
