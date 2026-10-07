import Image from "next/image";
import { cn } from "@/lib/utils";

export function RemoteImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  quality = 70,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}) {
  if (!src) {
    return <div className={cn("bg-muted", className)} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      loading={priority ? "eager" : "lazy"}
      className={cn("object-cover", className)}
    />
  );
}
