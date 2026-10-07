"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { EmptyState } from "@/components/ui/empty-state";
import type { Category, Product } from "@/types";

type Sort = "featured" | "price-asc" | "price-desc";

export function Catalog({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [categoryId, setCategoryId] = useState<string>("all");
  const [color, setColor] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const selectedCategory = categories.find((category) => category.id === categoryId);
  const browsingAll = categoryId === "all";

  const colors = useMemo(() => {
    const names = new Set<string>();
    const pool =
      browsingAll
        ? products
        : products.filter((product) => product.category_id === categoryId);
    for (const product of pool) {
      for (const item of product.colors) names.add(item.name);
    }
    return [...names];
  }, [products, categoryId, browsingAll]);

  const visible = useMemo(() => {
    let next = products.filter((product) => product.in_stock);
    if (!browsingAll) {
      next = next.filter((product) => product.category_id === categoryId);
    }
    if (color !== "all") {
      next = next.filter((product) =>
        product.colors.some((item) => item.name === color)
      );
    }
    if (sort === "price-asc") next = [...next].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") next = [...next].sort((a, b) => b.price - a.price);
    return next;
  }, [products, categoryId, color, sort, browsingAll]);

  const featured = browsingAll && color === "all"
    ? visible.filter((product) => product.is_featured)
    : [];
  const grid = featured.length > 0
    ? visible.filter((product) => !product.is_featured)
    : visible;

  function pickCategory(id: string) {
    setCategoryId(id);
    setColor("all");
    requestAnimationFrame(() => {
      document.getElementById("product-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <div id="products" className="scroll-mt-20">
      <section className="px-4 pt-10">
        <h2 className="font-heading text-2xl text-maroon">Shop by category</h2>
        <div
          className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2"
          role="tablist"
          aria-label="Product categories"
        >
          <Chip active={browsingAll} onClick={() => pickCategory("all")}>
            All
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category.id}
              active={categoryId === category.id}
              onClick={() => pickCategory(category.id)}
            >
              {category.name}
            </Chip>
          ))}
        </div>
      </section>
      <div id="product-results" className="scroll-mt-20">
        {featured.length > 0 ? (
          <section className="px-4 py-10">
            <h2 className="font-heading text-2xl text-maroon">Diwali gift packs</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}
        <section className="px-4 pb-10">
          <h2 className="font-heading text-2xl text-maroon">
            {selectedCategory?.name ?? "All diyas"}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="text-sm text-maroon">
              Colour
              <select
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="ml-2 h-11 rounded-lg border border-gold/50 bg-card px-3 text-sm"
              >
                <option value="all">All colours</option>
                {colors.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-maroon">
              Sort
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="ml-2 h-11 rounded-lg border border-gold/50 bg-card px-3 text-sm"
              >
                <option value="featured">Default</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
          {products.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No diyas listed yet"
                description="Check back soon, or message us on WhatsApp to order."
              />
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No diyas match those filters"
                description="Try another colour or category."
              />
            </div>
          ) : grid.length === 0 && featured.length > 0 ? null : (
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {grid.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`h-11 shrink-0 rounded-full px-4 text-sm ${
        active
          ? "bg-[#4A0E1C] text-[#FFF6E5]"
          : "border border-gold/50 bg-card text-[#4A0E1C]"
      }`}
    >
      {children}
    </button>
  );
}
