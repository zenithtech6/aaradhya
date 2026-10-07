"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FilePickers } from "@/components/admin/FilePickers";
import { Button } from "@/components/ui/button";
import {
  PRODUCT_LOOKS,
  buildLookPrompt,
  buildManualPromptPack,
  type ProductLookId,
} from "@/lib/ai-product-image";
import { uploadStoreImage } from "@/lib/upload";

type Draft = { id: string; url: string };

export function ProductImagesEditor({
  name,
  description,
  images,
  litImage,
  onAddImage,
  onRemoveImage,
  onCoverImage,
  onLitImage,
}: {
  name: string;
  description: string;
  images: string[];
  litImage: string;
  onAddImage: (url: string) => void;
  onRemoveImage: (url: string) => void;
  onCoverImage: (url: string) => void;
  onLitImage: (next: string) => void;
}) {
  const [references, setReferences] = useState<string[]>([]);
  const [looks, setLooks] = useState<ProductLookId[]>(["diwali", "hands", "studio"]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [generating, setGenerating] = useState(false);
  const [keepingId, setKeepingId] = useState<string | null>(null);

  async function uploadTo(files: FileList | null, target: "refs" | "stack" | "lit") {
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        const url = await uploadStoreImage(file);
        if (target === "refs") setReferences((prev) => [...prev, url].slice(0, 3));
        else if (target === "lit") onLitImage(url);
        else onAddImage(url);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      }
    }
  }

  function toggleLook(id: ProductLookId) {
    setLooks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function copyPrompts() {
    const text = buildManualPromptPack({ name, description, lookIds: looks });
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Prompts copied. Attach your photos in Gemini or ChatGPT and paste one prompt at a time.");
    } catch {
      toast.error("Could not copy. Select the prompts below and copy them.");
    }
  }

  async function generate() {
    if (references.length === 0) {
      toast.error("Add 2–3 photos of the real diya from different angles first.");
      return;
    }
    if (looks.length === 0) {
      toast.error("Pick at least one look.");
      return;
    }
    setGenerating(true);
    try {
      const prompts = looks.map((lookId) =>
        buildLookPrompt({ name, description, lookId })
      );
      const res = await fetch("/api/admin/product-image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts, imageUrls: references }),
      });
      const data = (await res.json()) as { drafts?: Draft[]; error?: string };
      const next = data.drafts;
      if (!res.ok || !next?.length) {
        throw new Error(data.error || "Could not generate images");
      }
      setDrafts((prev) => [...prev, ...next]);
      toast.success("Pick a cover, keep the ones you like, discard the rest.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generate failed");
    } finally {
      setGenerating(false);
    }
  }

  async function keep(draft: Draft, asCover: boolean, asLit: boolean) {
    setKeepingId(draft.id);
    try {
      const res = await fetch("/api/admin/product-image/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: draft.url }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not save image");
      }
      if (asLit) onLitImage(data.url);
      else if (asCover) onCoverImage(data.url);
      else onAddImage(data.url);
      setDrafts((prev) => prev.filter((row) => row.id !== draft.id));
      toast.success(asCover ? "Set as display image" : "Added to the photo stack");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not keep image");
    } finally {
      setKeepingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <fieldset className="rounded-xl border border-gold/40 p-3">
        <legend className="px-1 text-sm font-medium">1. Your photos (2–3 angles)</legend>
        <p className="mb-2 text-xs text-muted-foreground">
          Shoot the real product: front, side, and top. These are only references for AI — they are not shown in the shop unless you add them below.
        </p>
        <FilePickers multiple onFiles={(files) => void uploadTo(files, "refs")} />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {references.map((src) => (
            <figure key={src} className="relative overflow-hidden rounded-lg border border-gold/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Reference angle" className="aspect-square w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/55 p-1 text-[10px] text-white">
                {images.includes(src) ? (
                  <span className="px-1">In shop</span>
                ) : (
                  <button
                    type="button"
                    className="underline"
                    onClick={() => onAddImage(src)}
                  >
                    Add to shop
                  </button>
                )}
                <button
                  type="button"
                  className="ml-auto underline"
                  onClick={() => setReferences((prev) => prev.filter((item) => item !== src))}
                >
                  Remove
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-gold/40 p-3">
        <legend className="px-1 text-sm font-medium">2. Generate looks</legend>
        <p className="mb-2 text-xs text-muted-foreground">
          In-app generate uses a free public service and is often busy. Safer: copy a prompt, attach your 2–3 photos on Gemini or ChatGPT, download the image, then upload it in step 3.
        </p>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_LOOKS.map((look) => {
            const on = looks.includes(look.id);
            return (
              <button
                key={look.id}
                type="button"
                onClick={() => toggleLook(look.id)}
                className={`h-11 rounded-full px-4 text-sm ${
                  on ? "bg-[#4A0E1C] text-[#FFF6E5]" : "border border-gold/50 text-[#4A0E1C]"
                }`}
              >
                {look.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" className="h-11" onClick={() => void copyPrompts()}>
            Copy prompts for Gemini / ChatGPT
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={generating || references.length === 0}
            onClick={() => void generate()}
          >
            {generating ? "Generating looks…" : "Try free generate"}
          </Button>
        </div>
        <textarea
          readOnly
          className="mt-3 min-h-28 w-full rounded-lg border border-gold/50 bg-white px-3 py-2 font-mono text-xs"
          value={buildManualPromptPack({ name, description, lookIds: looks })}
        />
        {drafts.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {drafts.map((draft) => (
              <figure key={draft.id} className="overflow-hidden rounded-lg border border-gold/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={draft.url} alt="AI look to review" className="aspect-square w-full object-cover" />
                <div className="flex flex-col gap-1 p-1">
                  <Button
                    type="button"
                    className="h-9 text-xs"
                    disabled={keepingId === draft.id}
                    onClick={() => void keep(draft, true, false)}
                  >
                    {keepingId === draft.id ? "Saving…" : "Use as display"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs"
                    disabled={keepingId === draft.id}
                    onClick={() => void keep(draft, false, false)}
                  >
                    Add to stack
                  </Button>
                  <button
                    type="button"
                    className="text-[11px] underline"
                    onClick={() => void keep(draft, false, true)}
                  >
                    Keep as lit image
                  </button>
                  <button
                    type="button"
                    className="text-[11px] underline"
                    onClick={() => setDrafts((prev) => prev.filter((row) => row.id !== draft.id))}
                  >
                    Discard
                  </button>
                </div>
              </figure>
            ))}
          </div>
        ) : null}
      </fieldset>

      <fieldset className="rounded-xl border border-gold/40 p-3">
        <legend className="px-1 text-sm font-medium">3. Shop display stack</legend>
        <p className="mb-2 text-xs text-muted-foreground">
          The first image is the cover customers see. Add more from gallery or camera, or delete any you do not want.
        </p>
        <FilePickers multiple onFiles={(files) => void uploadTo(files, "stack")} />
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, index) => (
            <figure key={`${src}-${index}`} className="relative overflow-hidden rounded-lg border border-gold/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-square w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/55 p-1 text-[10px] text-white">
                {index === 0 ? (
                  <span className="px-1">Display</span>
                ) : (
                  <button type="button" className="underline" onClick={() => onCoverImage(src)}>
                    Set display
                  </button>
                )}
                <button
                  type="button"
                  className="ml-auto underline"
                  onClick={() => onRemoveImage(src)}
                >
                  Remove
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-gold/40 p-3">
        <legend className="px-1 text-sm font-medium">Lit image</legend>
        <FilePickers onFiles={(files) => void uploadTo(files, "lit")} />
        {litImage ? (
          <div className="mt-2 flex items-start gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={litImage} alt="Lit" className="h-24 rounded-lg object-cover" />
            <button type="button" className="text-sm underline" onClick={() => onLitImage("")}>
              Remove
            </button>
          </div>
        ) : null}
      </fieldset>
    </div>
  );
}
