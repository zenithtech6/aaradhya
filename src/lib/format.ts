export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function percentOff(price: number, mrp: number | null): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function parsePincodes(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((pin) => pin.trim())
    .filter(Boolean);
}

export function isDeliverable(
  pincode: string,
  deliverablePincodes: string | null | undefined
): boolean {
  const allowed = parsePincodes(deliverablePincodes);
  if (allowed.length === 0) return true;
  return allowed.includes(pincode.trim());
}
