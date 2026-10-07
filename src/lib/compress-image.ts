const MAX_BYTES = 300 * 1024;
const MAX_DIM = 1600;

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
      "image/jpeg",
      quality
    );
  });
}

export async function compressImageFile(file: File): Promise<File> {
  if (file.size <= MAX_BYTES && file.type === "image/jpeg") return file;

  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;
  if (width > MAX_DIM || height > MAX_DIM) {
    const scale = MAX_DIM / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available");

  for (let attempt = 0; attempt < 6; attempt++) {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(bitmap, 0, 0, width, height);
    let quality = 0.85;
    let blob = await canvasToBlob(canvas, quality);
    while (blob.size > MAX_BYTES && quality > 0.4) {
      quality -= 0.1;
      blob = await canvasToBlob(canvas, quality);
    }
    if (blob.size <= MAX_BYTES) {
      return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
        type: "image/jpeg",
      });
    }
    width = Math.round(width * 0.8);
    height = Math.round(height * 0.8);
  }

  throw new Error("Could not compress image under 300 KB");
}
