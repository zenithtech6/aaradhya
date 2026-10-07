"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/types";

export function CategoryManager({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.from("categories").insert({
      name,
      slug: slugify(name),
      sort_order: categories.length + 1,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setName("");
    toast.success("Category added");
    router.refresh();
  }

  function countIn(id: string) {
    return products.filter((product) => product.category_id === id && !product.deleted_at)
      .length;
  }

  async function remove(id: string) {
    const used = countIn(id);
    const ok = confirm(
      used > 0
        ? `This category has ${used} product(s). Delete it anyway? Those products stay in the shop but will have no category.`
        : "Delete this category?"
    );
    if (!ok) return;
    const supabase = createClient();
    const { error: unlinkError } = await supabase
      .from("products")
      .update({ category_id: null })
      .eq("category_id", id);
    if (unlinkError) {
      toast.error(unlinkError.message);
      return;
    }
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Category deleted");
    router.refresh();
  }

  return (
    <section className="gold-border mt-10 rounded-2xl bg-card p-4">
      <h2 className="font-heading text-xl text-maroon">Categories</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between">
            <span>
              {category.name}
              {countIn(category.id) > 0 ? (
                <span className="text-muted-foreground"> · {countIn(category.id)}</span>
              ) : null}
            </span>
            <button type="button" className="text-maroon underline" onClick={() => remove(category.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="mt-4 flex gap-2">
        <input
          className="h-11 flex-1 rounded-lg border border-gold/50 bg-white px-3 text-sm"
          placeholder="New category"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button className="h-11">Add</Button>
      </form>
    </section>
  );
}
