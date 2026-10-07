"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { RemoteImage } from "@/components/media/RemoteImage";
import { Button } from "@/components/ui/button";
import { useScheduledBanners } from "@/hooks/use-scheduled-banners";
import type { Banner } from "@/types";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const live = useScheduledBanners(banners);
  const [ref, api] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    const timer = window.setInterval(() => api.scrollNext(), 6000);
    return () => {
      api.off("select", onSelect);
      window.clearInterval(timer);
    };
  }, [api, onSelect]);

  const slides =
    live.length > 0
      ? live
      : [
          {
            id: "fallback",
            title: "Light up this Diwali",
            subtitle: "Handmade diyas, delivered in 24 hours",
            cta_text: "Shop diyas",
            image_url: null,
          } satisfies Partial<Banner> & { id: string },
        ];

  function scrollToProducts() {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative" aria-roledescription="carousel" aria-label="Featured banners">
      <div className="overflow-hidden" ref={ref}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="relative min-h-[72vh] min-w-0 flex-[0_0_100%]">
              {slide.image_url ? (
                <RemoteImage
                  src={slide.image_url}
                  alt={slide.title || "Diwali banner"}
                  priority
                  quality={80}
                  sizes="100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-maroon via-[#6b1a2c] to-saffron" />
              )}
              <div className="absolute inset-0 bg-maroon/45" />
              <span className="sparkle top-16 left-[15%] delay-100" aria-hidden="true" />
              <span className="sparkle top-24 right-[20%] delay-300" aria-hidden="true" />
              <span className="sparkle bottom-32 left-[40%]" aria-hidden="true" />
              <div className="relative z-10 flex min-h-[72vh] flex-col items-center justify-center gap-4 px-6 text-center text-cream">
                <span className="flame text-6xl" aria-hidden="true" />
                <h1 className="font-heading max-w-xl text-4xl leading-tight sm:text-5xl">
                  {slide.title || "Light up this Diwali"}
                </h1>
                <p className="max-w-md text-base text-cream/90">
                  {slide.subtitle || "Handmade diyas with cash on delivery"}
                </p>
                <Button
                  size="lg"
                  className="h-11 bg-gold px-6 text-maroon hover:bg-gold/90"
                  onClick={scrollToProducts}
                >
                  {slide.cta_text || "Shop diyas"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 ? (
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${slideIndex + 1}`}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => api?.scrollTo(slideIndex)}
              className={`h-2 rounded-full ${
                slideIndex === index ? "w-6 bg-gold" : "w-2 bg-cream/60"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
