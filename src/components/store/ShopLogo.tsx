const DEFAULT_LOGO = "/logo.svg";

export function ShopLogo({
  src,
  name,
  className = "h-9 w-9",
}: {
  src?: string | null;
  name?: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || DEFAULT_LOGO}
      alt={name ? `${name} logo` : "Shop logo"}
      className={`shrink-0 rounded-full object-contain ${className}`}
    />
  );
}
