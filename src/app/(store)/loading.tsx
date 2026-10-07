import { ProductCardSkeleton } from "@/components/catalog/ProductCard";

export default function StoreLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading store</span>
      <div className="h-10 animate-pulse bg-maroon" />
      <div className="min-h-[50vh] animate-pulse bg-muted" />
      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </div>
  );
}
