import { Suspense } from "react";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/queries";

export default function SettingsPage() {
  return (
    <Suspense fallback={<p>Loading settings…</p>}>
      <SettingsContent />
    </Suspense>
  );
}

async function SettingsContent() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-heading mb-6 text-3xl text-maroon">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
