export const PRODUCT_LOOKS = [
  {
    id: "diwali",
    label: "Diwali backdrop",
    prompt:
      "Keep the exact same handmade diya product from the reference photos. Place it on a festive Diwali set: marigold flowers, rangoli, warm gold light, cream and maroon tones. Professional ecommerce photo, sharp details, no text, no watermark, no logo.",
  },
  {
    id: "hands",
    label: "Holding in hands",
    prompt:
      "Keep the exact same handmade diya from the reference photos. A person gently holds it in both hands, close-up, warm skin tones, Diwali evening glow, creamy bokeh background. Photorealistic product photo, no text, no watermark.",
  },
  {
    id: "studio",
    label: "Studio listing",
    prompt:
      "Keep the exact same handmade diya from the reference photos. Clean ecommerce studio shot on a cream surface, soft box lighting, true product colour and shape, catalog quality. No text, no watermark, no extra props.",
  },
  {
    id: "lit",
    label: "Lit flame",
    prompt:
      "Keep the exact same handmade diya from the reference photos. The cotton wick is lit with a small warm golden flame, dark festive Diwali mood, glowing highlights on clay or brass. Photorealistic, no text, no watermark.",
  },
] as const;

export type ProductLookId = (typeof PRODUCT_LOOKS)[number]["id"];

export function buildLookPrompt(input: {
  name: string;
  description?: string;
  lookId: ProductLookId;
}): string {
  const look = PRODUCT_LOOKS.find((item) => item.id === input.lookId) ?? PRODUCT_LOOKS[0];
  const subject = input.name.trim() || "handmade Indian diya";
  const extra = input.description?.trim()
    ? `Product notes from the seller: ${input.description.trim().slice(0, 220)}.`
    : "";
  return [
    "I attached 2–3 photos of the SAME physical handmade diya from different angles.",
    "Identity lock: keep the exact product shape, size, colour, texture, paint, and decorations. Do not invent a different lamp.",
    `The product is: ${subject}.`,
    extra,
    `Scene to create: ${look.prompt}`,
    "Output one photorealistic square (1:1) ecommerce photo. No text, no logo, no watermark, no extra diyas, no fake branding.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildManualPromptPack(input: {
  name: string;
  description?: string;
  lookIds: ProductLookId[];
}): string {
  const ids = input.lookIds.length > 0 ? input.lookIds : PRODUCT_LOOKS.map((look) => look.id);
  return ids
    .map((id, index) => {
      const look = PRODUCT_LOOKS.find((item) => item.id === id);
      return `PROMPT ${index + 1} — ${look?.label ?? id}\n${buildLookPrompt({ ...input, lookId: id })}`;
    })
    .join("\n\n---\n\n");
}
