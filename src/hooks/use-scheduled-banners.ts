"use client";

import { useEffect, useState } from "react";
import { isBannerInSchedule } from "@/lib/banners";
import type { Banner } from "@/types";

export function useScheduledBanners(banners: Banner[]): Banner[] {
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  if (nowMs == null) return banners;
  return banners.filter((banner) => isBannerInSchedule(banner, nowMs));
}
