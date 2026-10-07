"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useScheduledBanners } from "@/hooks/use-scheduled-banners";
import { RemoteImage } from "@/components/media/RemoteImage";
import type { Banner } from "@/types";

const SESSION_KEY = "diya-popup-seen";

export function PopupAd({ banner }: { banner: Banner | null }) {
  const candidates = useMemo(() => (banner ? [banner] : []), [banner]);
  const live = useScheduledBanners(candidates);
  const scheduled = live[0] ?? null;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!scheduled) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const id = window.setTimeout(() => setOpen(true), 3000);
    return () => window.clearTimeout(id);
  }, [scheduled]);

  if (!scheduled || !open) return null;

  function close() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="gold-border relative w-full max-w-sm overflow-hidden rounded-2xl bg-cream"
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-2 right-2 z-10 flex size-11 items-center justify-center rounded-full bg-cream/90 text-maroon"
          aria-label="Close offer"
        >
          <X className="size-5" />
        </button>
        {scheduled.image_url ? (
          <div className="relative h-40">
            <RemoteImage src={scheduled.image_url} alt={scheduled.title || "Offer"} />
          </div>
        ) : null}
        <div className="p-4 text-center">
          <h2 id="popup-title" className="font-heading text-2xl text-maroon">
            {scheduled.title}
          </h2>
          {scheduled.subtitle ? (
            <p className="mt-2 text-sm text-maroon/80">{scheduled.subtitle}</p>
          ) : null}
          {scheduled.link ? (
            <a
              href={scheduled.link}
              onClick={close}
              className="mt-4 inline-flex h-11 items-center rounded-lg bg-maroon px-4 text-sm font-medium text-cream"
            >
              {scheduled.cta_text || "Shop now"}
            </a>
          ) : (
            <button
              type="button"
              onClick={close}
              className="mt-4 inline-flex h-11 items-center rounded-lg bg-maroon px-4 text-sm font-medium text-cream"
            >
              {scheduled.cta_text || "Got it"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
