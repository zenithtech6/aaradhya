import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/cart`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    const products = await getProducts();
    for (const product of products) {
      entries.push({
        url: `${base}/product/${product.slug}`,
        lastModified: product.created_at ? new Date(product.created_at) : undefined,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // Catalog unavailable during build; home and cart still list.
  }

  return entries;
}
