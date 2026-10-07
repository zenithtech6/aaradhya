import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "product-images";

function isAllowedImageHost(value: string): boolean {
  try {
    const host = new URL(value).hostname;
    return host === "image.pollinations.ai" || host.endsWith(".pollinations.ai");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in as admin first." }, { status: 401 });
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const source = String(body.url || "");
  if (!isAllowedImageHost(source)) {
    return NextResponse.json({ error: "That image source is not allowed." }, { status: 400 });
  }

  const res = await fetch(source, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: "Could not download the generated image." }, { status: 502 });
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
