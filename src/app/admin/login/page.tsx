import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { LoginForm } from "@/components/admin/LoginForm";
import { createClient } from "@/lib/supabase/server";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading…</p>}>
      <LoginGate />
    </Suspense>
  );
}

async function LoginGate() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-cream px-4 py-16">
      <LoginForm />
    </main>
  );
}
