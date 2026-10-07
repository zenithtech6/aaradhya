"use client";

import { useScheduledBanners } from "@/hooks/use-scheduled-banners";
import type { Banner } from "@/types";

export function OfferStrip({ banners }: { banners: Banner[] }) {
  const live = useScheduledBanners(banners);
  if (live.length === 0) return null;
  const text = live
    .map((banner) => banner.title || banner.subtitle)
    .filter(Boolean)
    .join("  •  ");
  const loop = `${text}  •  ${text}  •  `;

  return (
    <div className="overflow-hidden bg-maroon py-2 text-sm text-gold" role="region" aria-label="Offers">
      <p className="sr-only">{text}</p>
      <div className="marquee-track gap-8 px-4" aria-hidden="true">
        <p className="whitespace-nowrap">{loop}</p>
        <p className="whitespace-nowrap">{loop}</p>
      </div>
    </div>
  );
}
