"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { FilePickers } from "@/components/admin/FilePickers";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { uploadStoreImage } from "@/lib/upload";
import type { Settings } from "@/types";

const inputClass =
  "mt-1 h-11 w-full rounded-lg border border-gold/50 bg-white px-3 text-sm";

const keys: (keyof Settings)[] = [
  "shop_name",
  "logo_url",
  "whatsapp_number",
  "call_number",
  "store_address",
  "store_map_url",
  "deliverable_pincodes",
  "diwali_date",
];

export function SettingsForm({ settings }: { settings: Settings | null }) {
  const [form, setForm] = useState<Settings>(
    settings ?? {
      shop_name: "",
      logo_url: "",
      whatsapp_number: "",
      call_number: "",
      store_address: "",
      store_map_url: "",
      deliverable_pincodes: "",
      diwali_date: "",
    }
  );
  const [qr, setQr] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const rows = keys.map((key) => ({ key, value: form[key] }));
    const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Settings saved");
  }

  async function makeQr() {
    const url = `${window.location.origin}/?src=box`;
    const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 2 });
    setQr(dataUrl);
  }

  function downloadQr() {
    if (!qr) return;
    const link = document.createElement("a");
    link.href = qr;
    link.download = "diya-store-qr.png";
    link.click();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-3">
        <label className="block text-sm">
          Shop name
          <input className={inputClass} value={form.shop_name} onChange={(e) => setForm({ ...form, shop_name: e.target.value })} />
        </label>
        <div className="space-y-2 text-sm">
          <p>Logo</p>
          <FilePickers
            onFiles={async (files) => {
              if (!files?.[0]) return;
              try {
                const url = await uploadStoreImage(files[0]);
                setForm((prev) => ({ ...prev, logo_url: url }));
                toast.success("Logo uploaded. Save settings to keep it.");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Upload failed");
              }
            }}
          />
          {form.logo_url ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logo_url} alt="Shop logo" className="h-16 w-16 rounded-full object-contain bg-[#4A0E1C] p-1" />
              <button
                type="button"
                className="underline"
                onClick={() => setForm((prev) => ({ ...prev, logo_url: "" }))}
              >
                Remove logo
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Used in the header, footer, and PDF bills. PNG or JPG works best on bills.</p>
          )}
        </div>
        <label className="block text-sm">
          WhatsApp number
          <input className={inputClass} value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} />
        </label>
        <label className="block text-sm">
          Call number
          <input className={inputClass} value={form.call_number} onChange={(e) => setForm({ ...form, call_number: e.target.value })} />
        </label>
        <label className="block text-sm">
          Store address
          <textarea className={`${inputClass} min-h-20 py-2`} value={form.store_address} onChange={(e) => setForm({ ...form, store_address: e.target.value })} />
        </label>
        <label className="block text-sm">
          Map URL
          <input className={inputClass} value={form.store_map_url} onChange={(e) => setForm({ ...form, store_map_url: e.target.value })} />
        </label>
        <label className="block text-sm">
          Deliverable pincodes
          <input className={inputClass} value={form.deliverable_pincodes} onChange={(e) => setForm({ ...form, deliverable_pincodes: e.target.value })} />
        </label>
        <label className="block text-sm">
          Diwali date
          <input type="date" className={inputClass} value={form.diwali_date} onChange={(e) => setForm({ ...form, diwali_date: e.target.value })} />
        </label>
        <Button className="h-11" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </form>
      <section className="gold-border rounded-2xl bg-card p-4">
        <h2 className="font-heading text-xl text-maroon">Box QR code</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Encodes this site with <code>?src=box</code>
        </p>
        <Button type="button" className="mt-4 h-11" onClick={makeQr}>
          Generate QR
        </Button>
        {qr ? (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Store QR code" className="h-48 w-48" />
            <Button type="button" variant="outline" className="mt-3 h-11" onClick={downloadQr}>
              Download PNG
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
