import { compressImageFile } from "@/lib/compress-image";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "product-images";

export async function uploadStoreImage(file: File): Promise<string> {
  const compressed = await compressImageFile(file);
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Sign in as admin on this device, then try the upload again.");
  }
  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (error) {
    if (/row-level security| RLS /i.test(error.message)) {
      throw new Error(
        "Upload blocked by Storage RLS. Run supabase/storage-policies.sql in the Supabase SQL editor, then retry."
      );
    }
    throw error;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
