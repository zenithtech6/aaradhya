import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const WIDTH = 768;
const HEIGHT = 768;
const MAX_REFS = 3;
const MAX_LOOKS = 4;

function isAllowedRef(value: string): boolean {
  try {
    const host = new URL(value).hostname;
    return host.endsWith("supabase.co") || host.endsWith("supabase.in");
  } catch {
    return false;
  }
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Sign in as admin first." }, { status: 401 });
  }

  let body: { prompts?: string[]; imageUrls?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const imageUrls = (body.imageUrls ?? []).map(String).filter(isAllowedRef).slice(0, MAX_REFS);
  if (imageUrls.length === 0) {
    return NextResponse.json(
      { error: "Upload 2–3 photos of the real product first." },
      { status: 400 }
    );
  }

  const prompts = (body.prompts ?? [])
    .map((item) => String(item).trim().slice(0, 500))
    .filter((item) => item.length >= 8)
    .slice(0, MAX_LOOKS);

  if (prompts.length === 0) {
    return NextResponse.json({ error: "Pick at least one look to generate." }, { status: 400 });
  }

  const drafts: { id: string; url: string }[] = [];
  const joined = imageUrls.join("|");

  for (const prompt of prompts) {
    const seed = Math.floor(Math.random() * 1_000_000_000);
    const params = new URLSearchParams({
      model: "kontext",
      width: String(WIDTH),
      height: String(HEIGHT),
      nologo: "true",
      seed: String(seed),
      image: joined,
    });
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "image/*" },
    });
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !type.startsWith("image/")) {
      continue;
    }
    drafts.push({ id: `${seed}`, url });
  }

  if (drafts.length === 0) {
    return NextResponse.json(
      { error: "The free image service is busy. Try again in a moment." },
      { status: 502 }
    );
  }

  return NextResponse.json({ drafts });
}
