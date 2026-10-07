import { Suspense } from "react";
import { connection } from "next/server";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingWhatsApp } from "@/components/store/FloatingWhatsApp";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { PopupAd } from "@/components/store/PopupAd";
import { StickyBottomBar } from "@/components/store/StickyBottomBar";
import { getActiveBanners, getSettings } from "@/lib/queries";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-gold focus:px-3 focus:py-2 focus:text-maroon"
      >
        Skip to content
      </a>
      <Suspense fallback={<header className="h-14 bg-maroon" aria-hidden="true" />}>
        <StoreHeader />
      </Suspense>
      <main id="main-content" className="flex flex-1 flex-col pb-20 md:pb-0">
        {children}
      </main>
      <Suspense fallback={<footer className="h-32 bg-maroon" aria-hidden="true" />}>
        <StoreChrome />
      </Suspense>
    </div>
  );
}

async function StoreHeader() {
  await connection();
  const settings = await getSettings();
  return <Header shopName={settings?.shop_name} logoUrl={settings?.logo_url} />;
}

async function StoreChrome() {
  await connection();
  const [settings, popups] = await Promise.all([
    getSettings(),
    getActiveBanners("popup"),
  ]);

  return (
    <>
      <Footer settings={settings} />
      <CartDrawer settings={settings} />
      <StickyBottomBar whatsappNumber={settings?.whatsapp_number} />
      <FloatingWhatsApp number={settings?.whatsapp_number} />
      <PopupAd banner={popups[0] ?? null} />
    </>
  );
}
