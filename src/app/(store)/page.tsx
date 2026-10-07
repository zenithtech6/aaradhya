import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Catalog } from "@/components/catalog/Catalog";
import { ProductCardSkeleton } from "@/components/catalog/ProductCard";
import { Countdown } from "@/components/home/Countdown";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { OfferStrip } from "@/components/home/OfferStrip";
import { StoreLocation } from "@/components/home/StoreLocation";
import { WhyUs } from "@/components/home/WhyUs";
import {
  getActiveBanners,
  getCategories,
  getProducts,
  getSettings,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Handmade Diyas for Diwali",
  description:
    "Shop handmade clay and brass diyas. Cash on delivery and 24-hour delivery in selected pincodes.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  await connection();
  const [settings, offers, carousels, categories, products] = await Promise.all([
    getSettings(),
    getActiveBanners("offer"),
    getActiveBanners("carousel"),
    getCategories(),
    getProducts(),
  ]);

  return (
    <>
      <OfferStrip banners={offers} />
      <HeroCarousel banners={carousels} />
      <Countdown date={settings?.diwali_date} />
      <Catalog products={products} categories={categories} />
      <WhyUs />
      <StoreLocation settings={settings} />
    </>
  );
}

function HomeFallback() {
  return (
    <div>
      <div className="h-10 animate-pulse bg-maroon" />
      <div className="min-h-[72vh] animate-pulse bg-muted" />
      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </div>
  );
}
