"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp({ number }: { number?: string }) {
  if (!number) return null;
  const href = buildWhatsAppUrl(number, "Hi, I would like to order diyas.");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-4 bottom-24 z-30 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg md:bottom-6"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
