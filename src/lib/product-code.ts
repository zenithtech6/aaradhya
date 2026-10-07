export function normalizeProductCode(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function suggestProductCode(name: string): string {
  const stem =
    name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase() || "ITEM";
  return `DY-${stem}`;
}
