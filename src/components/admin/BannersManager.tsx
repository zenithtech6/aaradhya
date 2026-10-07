"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { uploadStoreImage } from "@/lib/upload";
import type { Banner, BannerType } from "@/types";

const inputClass =
  "mt-1 h-11 w-full rounded-lg border border-gold/50 bg-white px-3 text-sm";

const empty: Omit<Banner, "id"> = {
  type: "carousel",
  title: "",
  subtitle: "",
  image_url: null,
  link: "",
  cta_text: "",
  active: true,
  sort_order: 0,
  starts_at: null,
  ends_at: null,
};

function toLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function BannersManager({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(empty);

  function startNew() {
    setEditing(null);
    setForm(empty);
  }

  function startEdit(banner: Banner) {
    setEditing(banner);
    setForm({
      type: banner.type,
      title: banner.title ?? "",
      subtitle: banner.subtitle ?? "",
      image_url: banner.image_url,
      link: banner.link ?? "",
      cta_text: banner.cta_text ?? "",
      active: banner.active,
      sort_order: banner.sort_order,
      starts_at: banner.starts_at,
      ends_at: banner.ends_at,
    });
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      ...form,
      title: form.title || null,
      subtitle: form.subtitle || null,
      link: form.link || null,
      cta_text: form.cta_text || null,
      sort_order: Number(form.sort_order) || 0,
    };
    const supabase = createClient();
    const { error } = editing
      ? await supabase.from("banners").update(payload).eq("id", editing.id)
      : await supabase.from("banners").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Banner saved");
    startNew();
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this banner?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Banner deleted");
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-heading text-xl text-maroon">All banners</h2>
        <ul className="mt-3 space-y-2">
          {banners.map((banner) => (
            <li key={banner.id} className="flex items-center justify-between rounded-lg border border-gold/40 px-3 py-2 text-sm">
              <span>
                {banner.type} · {banner.title || "Untitled"}
              </span>
              <span className="space-x-2">
                <button type="button" className="underline" onClick={() => startEdit(banner)}>
                  Edit
                </button>
                <button type="button" className="text-maroon underline" onClick={() => remove(banner.id)}>
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={save} className="space-y-3">
        <h2 className="font-heading text-xl text-maroon">
          {editing ? "Edit banner" : "New banner"}
        </h2>
        <label className="block text-sm">
          Type
          <select
            className={inputClass}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as BannerType })}
          >
            <option value="carousel">carousel</option>
            <option value="offer">offer</option>
            <option value="popup">popup</option>
          </select>
        </label>
        <label className="block text-sm">
          Title
          <input className={inputClass} value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="block text-sm">
          Subtitle
          <input className={inputClass} value={form.subtitle ?? ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
        </label>
        <label className="block text-sm">
          Link
          <input className={inputClass} value={form.link ?? ""} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        </label>
        <label className="block text-sm">
          CTA text
          <input className={inputClass} value={form.cta_text ?? ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} />
        </label>
        <label className="block text-sm">
          Image
          <input
            className="mt-1 block"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const url = await uploadStoreImage(file);
                setForm((prev) => ({ ...prev, image_url: url }));
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Upload failed");
              }
            }}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            Starts
            <input
              type="datetime-local"
              className={inputClass}
              value={toLocal(form.starts_at)}
              onChange={(e) =>
                setForm({ ...form, starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })
              }
            />
          </label>
          <label className="block text-sm">
            Ends
            <input
              type="datetime-local"
              className={inputClass}
              value={toLocal(form.ends_at)}
              onChange={(e) =>
                setForm({ ...form, ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })
              }
            />
          </label>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>
          <label>
            Sort
            <input
              className="ml-2 h-10 w-20 rounded-lg border border-gold/50 px-2"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
            />
          </label>
        </div>
        <div className="flex gap-2">
          <Button className="h-11">Save banner</Button>
          {editing ? (
            <Button type="button" variant="outline" className="h-11" onClick={startNew}>
              New
            </Button>
          ) : null}
        </div>
        {form.type === "popup" ? (
          <div className="gold-border mt-4 rounded-2xl bg-cream p-4 text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Popup preview</p>
            {form.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="" className="mx-auto mt-2 h-32 rounded-lg object-cover" />
            ) : null}
            <p className="font-heading mt-2 text-2xl text-maroon">{form.title || "Title"}</p>
            <p className="mt-1 text-sm">{form.subtitle || "Subtitle"}</p>
            <span className="mt-3 inline-flex h-10 items-center rounded-lg bg-[#4A0E1C] px-4 text-sm text-[#FFF6E5]">
              {form.cta_text || "Shop now"}
            </span>
          </div>
        ) : null}
      </form>
    </div>
  );
}
