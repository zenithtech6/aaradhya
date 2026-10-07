import type { Banner } from "@/types";

export function isBannerInSchedule(banner: Banner, nowMs: number): boolean {
  if (banner.starts_at) {
    const start = Date.parse(banner.starts_at);
    if (!Number.isNaN(start) && start > nowMs) return false;
  }
  if (banner.ends_at) {
    const end = Date.parse(banner.ends_at);
    if (!Number.isNaN(end) && end < nowMs) return false;
  }
  return true;
}
