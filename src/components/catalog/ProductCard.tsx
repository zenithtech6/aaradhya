"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RemoteImage } from "@/components/media/RemoteImage";
import { Button } from "@/components/ui/button";
import { formatInr, percentOff } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  const [lit, setLit] = useState(false);
  const [colorName, setColorName] = useState(product.colors[0]?.name);

  const selectedColor = product.colors.find((color) => color.name === colorName);
  const unlit = selectedColor?.image || product.images[0] || "";
  const shown = lit && product.lit_image ? product.lit_image : unlit;
  const off = percentOff(product.price, product.mrp);

  const colorKey = useMemo(() => colorName, [colorName]);

  function addToCart() {
    add({
      productId: product.id,
      code: product.code,
      name: product.name,
      image: shown || unlit,
      price: product.price,
      color: colorKey,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      className="gold-border overflow-hidden rounded-2xl bg-card"
    >
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="relative block aspect-square">
          <RemoteImage
            src={shown}
            alt={product.name}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>
        {product.badge ? (
          <span className="absolute top-2 left-2 rounded-full bg-saffron px-2 py-0.5 text-xs font-semibold text-maroon">
            {product.badge}
          </span>
        ) : null}
        {off > 0 ? (
          <span className="absolute top-2 right-2 rounded-full bg-maroon px-2 py-0.5 text-xs font-semibold text-cream">
            {off}% off
          </span>
        ) : null}
        {product.lit_image ? (
          <button
            type="button"
            onMouseEnter={() => setLit(true)}
            onMouseLeave={() => setLit(false)}
            onClick={() => setLit((value) => !value)}
            aria-pressed={lit}
            className="absolute bottom-2 left-2 min-h-11 rounded-full bg-maroon/80 px-3 py-2 text-xs text-cream"
          >
            {lit ? "See unlit" : "See it lit"}
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 p-3">
        <Link href={`/product/${product.slug}`} className="font-heading text-lg text-maroon">
          {product.name}
        </Link>
        {product.code ? (
          <p className="font-mono text-[11px] text-maroon/70">{product.code}</p>
        ) : null}
        {product.colors.length > 0 ? (
          <div className="flex gap-1.5">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                aria-label={color.name}
                aria-pressed={color.name === colorName}
                onClick={() => setColorName(color.name)}
                className={`size-7 rounded-full border ${
                  color.name === colorName ? "border-maroon ring-2 ring-gold" : "border-gold/40"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        ) : null}
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-maroon">{formatInr(product.price)}</span>
          {product.mrp && product.mrp > product.price ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatInr(product.mrp)}
            </span>
          ) : null}
        </div>
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            className="h-11 w-full bg-maroon text-cream hover:bg-maroon/90"
            disabled={!product.in_stock}
            onClick={addToCart}
          >
            {product.in_stock ? "Add to cart" : "Out of stock"}
          </Button>
        </motion.div>
      </div>
    </motion.article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gold/30 bg-card">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
