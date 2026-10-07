import { Phone } from "lucide-react";
import type { Settings } from "@/types";

export function StoreLocation({ settings }: { settings: Settings | null }) {
  if (!settings?.store_address && !settings?.call_number) return null;

  return (
    <section className="px-4 py-10">
      <h2 className="font-heading text-2xl text-maroon">Visit the store</h2>
      <p className="mt-2 whitespace-pre-line text-sm text-maroon/80">
        {settings.store_address}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {settings.store_map_url ? (
          <a
            href={settings.store_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-lg border border-gold bg-card px-4 text-sm font-medium text-maroon"
          >
            Open map
          </a>
        ) : null}
        {settings.call_number ? (
          <a
            href={`tel:${settings.call_number}`}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-maroon px-4 text-sm font-medium text-cream"
          >
            <Phone className="size-4" />
            Call to order
          </a>
        ) : null}
      </div>
    </section>
  );
}
