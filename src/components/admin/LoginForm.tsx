"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShopLogo } from "@/components/store/ShopLogo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="gold-border mx-auto w-full max-w-sm space-y-4 rounded-2xl bg-card p-6"
    >
      <div className="flex items-center gap-3">
        <ShopLogo className="h-12 w-12 bg-[#4A0E1C] p-1" />
        <h1 className="font-heading text-2xl text-maroon">Admin login</h1>
      </div>
      <label className="block text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          className="mt-1 h-11 w-full rounded-lg border border-gold/50 bg-white px-3"
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          name="password"
          type="password"
          required
          className="mt-1 h-11 w-full rounded-lg border border-gold/50 bg-white px-3"
        />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button className="h-11 w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
