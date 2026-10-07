"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ProductCard } from "@/components/catalog/ProductCard";
import { RemoteImage } from "@/components/media/RemoteImage";
import { Button } from "@/components/ui/button";
import { formatInr, percentOff } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const add = useCart((state) => state.add);
  const [lit, setLit] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [colorName, setColorName] = useState(product.colors[0]?.name);
  const [packLabel, setPackLabel] = useState(product.pack_options[0]?.label);
  const [qty, setQty] = useState(1);

  const selectedColor = product.colors.find((color) => color.name === colorName);
  const selectedPack = product.pack_options.find((pack) => pack.label === packLabel);
  const gallery = useMemo(() => {
    const images = [...product.images];
    if (selectedColor?.image && !images.includes(selectedColor.image)) {
      images.unshift(selectedColor.image);
    }
    return images;
  }, [product.images, selectedColor]);

  const current = lit && product.lit_image ? product.lit_image : gallery[imageIndex] || gallery[0] || "";
  const price = selectedPack?.price ?? product.price;
  const off = percentOff(price, product.mrp);

  function addToCart() {
    add({
      productId: product.id,
      code: product.code,
      name: product.name,
      image: current,
      price,
      qty,
      color: colorName,
      pack: packLabel,
    });
    toast.success(`${product.name} added to cart`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-gold/40">
            <RemoteImage src={current} alt={product.name} priority sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => {
                    setLit(false);
                    setImageIndex(index);
                  }}
                  className={`relative size-16 shrink-0 overflow-hidden rounded-lg border ${
                    !lit && imageIndex === index ? "border-maroon" : "border-gold/40"
                  }`}
                >
                  <RemoteImage src={src} alt="" sizes="64px" />
                </button>
              ))}
            </div>
          ) : null}
          {product.lit_image ? (
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-11"
              aria-pressed={lit}
              onClick={() => setLit((value) => !value)}
            >
              {lit ? "See unlit" : "See it lit"}
            </Button>
          ) : null}
        </div>
        <div>
          {product.badge ? (
            <p className="text-sm font-semibold text-saffron">{product.badge}</p>
          ) : null}
          <h1 className="font-heading mt-1 text-3xl text-maroon">{product.name}</h1>
          {product.code ? (
            <p className="mt-1 font-mono text-xs font-semibold text-maroon/70">Code: {product.code}</p>
          ) : null}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-maroon">{formatInr(price)}</span>
            {product.mrp && product.mrp > price ? (
              <>
                <span className="text-muted-foreground line-through">{formatInr(product.mrp)}</span>
                <span className="text-sm font-medium text-saffron">{off}% off</span>
              </>
            ) : null}
          </div>
          {product.description ? (
            <p className="mt-4 text-sm leading-6 text-maroon/80">{product.description}</p>
          ) : null}
          {product.colors.length > 0 ? (
            <div className="mt-5">
              <p className="text-sm font-medium">Colour: {colorName}</p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      setColorName(color.name);
                      setLit(false);
                      setImageIndex(0);
                    }}
                    className={`size-7 rounded-full border ${
                      color.name === colorName ? "ring-2 ring-gold ring-offset-2" : "border-gold/40"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
          ) : null}
          {product.pack_options.length > 0 ? (
            <div className="mt-5">
              <p className="text-sm font-medium">Pack</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.pack_options.map((pack) => (
                  <button
                    key={pack.label}
                    type="button"
                    onClick={() => setPackLabel(pack.label)}
                    className={`h-10 rounded-full px-3 text-sm ${
                      pack.label === packLabel
                        ? "bg-maroon text-cream"
                        : "border border-gold/50 bg-card"
                    }`}
                  >
                    {pack.label} · {formatInr(pack.price)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-11 items-center rounded-lg border border-gold/50">
              <button type="button" className="px-3" onClick={() => setQty((n) => Math.max(1, n - 1))}>
                −
              </button>
              <span className="min-w-8 text-center">{qty}</span>
              <button type="button" className="px-3" onClick={() => setQty((n) => n + 1)}>
                +
              </button>
            </div>
            <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
              <Button
                className="h-11 w-full bg-maroon text-cream hover:bg-maroon/90"
                disabled={!product.in_stock}
                onClick={addToCart}
              >
                {product.in_stock ? "Add to cart" : "Out of stock"}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-heading text-2xl text-maroon">Related diyas</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
