import { Suspense } from "react";
import { BannersManager } from "@/components/admin/BannersManager";
import { getAllBanners } from "@/lib/queries";

export default function BannersPage() {
  return (
    <Suspense fallback={<p>Loading banners…</p>}>
      <BannersContent />
    </Suspense>
  );
}

async function BannersContent() {
  const banners = await getAllBanners();
  return (
    <div>
      <h1 className="font-heading mb-6 text-3xl text-maroon">Banners</h1>
      <BannersManager banners={banners} />
    </div>
  );
}
