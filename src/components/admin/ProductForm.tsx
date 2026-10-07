"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FilePickers } from "@/components/admin/FilePickers";
import { ProductImagesEditor } from "@/components/admin/ProductImagesEditor";
import { Button } from "@/components/ui/button";
import { normalizeProductCode, suggestProductCode } from "@/lib/product-code";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/client";
import { uploadStoreImage } from "@/lib/upload";
import type { Category, PackOption, Product, ProductColor } from "@/types";

const inputClass =
  "mt-1 h-11 w-full rounded-lg border border-gold/50 bg-white px-3 text-sm";

export function ProductForm({
  product,
  categories,
}: {
  product?: Product | null;
  categories: Category[];
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(product));
  const [code, setCode] = useState(product?.code ?? "");
  const [codeLocked, setCodeLocked] = useState(Boolean(product?.code));
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [mrp, setMrp] = useState(product?.mrp != null ? String(product.mrp) : "");
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [hidden, setHidden] = useState(product?.is_hidden ?? false);
  const [featured, setFeatured] = useState(product?.is_featured ?? false);
  const [sortOrder, setSortOrder] = useState(String(product?.sort_order ?? 0));
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [litImage, setLitImage] = useState(product?.lit_image ?? "");
  const [colors, setColors] = useState<ProductColor[]>(product?.colors ?? []);
  const [packs, setPacks] = useState<PackOption[]>(product?.pack_options ?? []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugLocked) setSlug(slugify(name));
    if (!codeLocked && name) setCode(suggestProductCode(name));
  }, [name, slugLocked, codeLocked]);

  async function onFiles(
    files: FileList | null,
    onUrl: (url: string) => void
  ) {
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        const url = await uploadStoreImage(file);
        onUrl(url);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      }
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!normalizeProductCode(code)) {
      toast.error("Enter a product code");
      return;
    }
    setSaving(true);
    const payload = {
      name,
      slug,
      code: normalizeProductCode(code),
      description: description || null,
      category_id: categoryId || null,
      price: Number(price),
      mrp: mrp ? Number(mrp) : null,
      badge: badge || null,
      in_stock: inStock,
      is_hidden: hidden,
      is_featured: featured,
      sort_order: Number(sortOrder) || 0,
      images,
      lit_image: litImage || null,
      colors,
      pack_options: packs,
    };
    const supabase = createClient();
    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product saved");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-4">
      <label className="block text-sm">
        Name
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="block text-sm">
        Product code
        <input
          className={`${inputClass} font-mono uppercase`}
          value={code}
          onChange={(e) => {
            setCodeLocked(true);
            setCode(e.target.value.toUpperCase());
          }}
          placeholder="DY-CLAY6"
          required
        />
        <span className="mt-1 block text-xs text-muted-foreground">
          Unique code for packing, billing, and search (letters, numbers, hyphen).
        </span>
      </label>
      <label className="block text-sm">
        Slug
        <input
          className={inputClass}
          value={slug}
          onChange={(e) => {
            setSlugLocked(true);
            setSlug(e.target.value);
          }}
          required
        />
      </label>
      <label className="block text-sm">
        Description
        <textarea
          className={`${inputClass} min-h-24 py-2`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        Category
        <select
          className={inputClass}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">None</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Price
          <input className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <label className="block text-sm">
          MRP
          <input className={inputClass} value={mrp} onChange={(e) => setMrp(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          Badge
          <input className={inputClass} value={badge} onChange={(e) => setBadge(e.target.value)} />
        </label>
        <label className="block text-sm">
          Sort order
          <input className={inputClass} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
        </label>
      </div>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In stock
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
          Hidden from shop
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
      </div>
      <ProductImagesEditor
        name={name}
        description={description}
        images={images}
        litImage={litImage}
        onAddImage={(url) =>
          setImages((prev) => (prev.includes(url) ? prev : [...prev, url]))
        }
        onRemoveImage={(url) => setImages((prev) => prev.filter((item) => item !== url))}
        onCoverImage={(url) =>
          setImages((prev) => [url, ...prev.filter((item) => item !== url)])
        }
        onLitImage={setLitImage}
      />
      <fieldset className="rounded-xl border border-gold/40 p-3">
        <legend className="px-1 text-sm font-medium">Colours</legend>
        {colors.map((color, index) => (
          <div key={index} className="mb-2 grid gap-2 sm:grid-cols-3">
            <input
              className={inputClass}
              placeholder="Name"
              value={color.name}
              onChange={(e) =>
                setColors((prev) =>
                  prev.map((row, i) => (i === index ? { ...row, name: e.target.value } : row))
                )
              }
            />
            <input
              className={inputClass}
              placeholder="#D4A017"
              value={color.hex}
              onChange={(e) =>
                setColors((prev) =>
                  prev.map((row, i) => (i === index ? { ...row, hex: e.target.value } : row))
                )
              }
            />
            <FilePickers
              onFiles={(files) =>
                onFiles(files, (url) =>
                  setColors((prev) =>
                    prev.map((row, i) => (i === index ? { ...row, image: url } : row))
                  )
                )
              }
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => setColors((prev) => [...prev, { name: "", hex: "#D4A017" }])}
        >
          Add colour
        </Button>
      </fieldset>
      <fieldset className="rounded-xl border border-gold/40 p-3">
        <legend className="px-1 text-sm font-medium">Pack options</legend>
        {packs.map((pack, index) => (
          <div key={index} className="mb-2 grid gap-2 sm:grid-cols-3">
            <input
              className={inputClass}
              placeholder="Label"
              value={pack.label}
              onChange={(e) =>
                setPacks((prev) =>
                  prev.map((row, i) => (i === index ? { ...row, label: e.target.value } : row))
                )
              }
            />
            <input
              className={inputClass}
              placeholder="Qty"
              value={pack.qty ?? ""}
              onChange={(e) =>
                setPacks((prev) =>
                  prev.map((row, i) =>
                    i === index ? { ...row, qty: Number(e.target.value) || undefined } : row
                  )
                )
              }
            />
            <input
              className={inputClass}
              placeholder="Price"
              value={pack.price}
              onChange={(e) =>
                setPacks((prev) =>
                  prev.map((row, i) =>
                    i === index ? { ...row, price: Number(e.target.value) || 0 } : row
                  )
                )
              }
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => setPacks((prev) => [...prev, { label: "", price: 0 }])}
        >
          Add pack
        </Button>
      </fieldset>
      <Button className="h-11" disabled={saving}>
        {saving ? "Saving…" : "Save product"}
      </Button>
    </form>
  );
}
