import { ShopLogo } from "@/components/store/ShopLogo";
import type { Settings } from "@/types";

export function Footer({ settings }: { settings: Settings | null }) {
  return (
    <footer className="mt-auto border-t border-gold/40 bg-maroon px-4 py-8 text-cream">
      <div className="flex items-center gap-3">
        <ShopLogo
          src={settings?.logo_url}
          name={settings?.shop_name}
          className="h-12 w-12 bg-cream/10 p-0.5"
        />
        <p className="font-heading text-lg">{settings?.shop_name || "Diwali Diya Store"}</p>
      </div>
      {settings?.store_address ? (
        <p className="mt-2 whitespace-pre-line text-sm text-cream/80">
          {settings.store_address}
        </p>
      ) : null}
      <nav className="mt-4 flex flex-wrap gap-4 text-sm text-gold" aria-label="Footer">
        <a href="/" className="underline-offset-2 hover:underline">
          Shop
        </a>
        <a href="/cart" className="underline-offset-2 hover:underline">
          Cart
        </a>
        {settings?.call_number ? (
          <a href={`tel:${settings.call_number}`} className="underline-offset-2 hover:underline">
            Call
          </a>
        ) : null}
      </nav>
      <p className="mt-4 text-xs text-gold/80">Cash on delivery • Delivered within 24 hours</p>
    </footer>
  );
}
