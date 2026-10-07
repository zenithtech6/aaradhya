import type { WhatsAppOrder } from "@/types";

const ORDER_ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderId(now?: Date): string {
  const date = now ?? new Date();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);

  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let suffix = "";
  for (const byte of bytes) {
    suffix += ORDER_ID_CHARS[byte % ORDER_ID_CHARS.length];
  }

  return `DY-${dd}${mm}${yy}-${suffix}`;
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function itemLine(
  item: WhatsAppOrder["items"][number],
  index: number
): string {
  const extras = [item.color, item.pack].filter(Boolean).join(", ");
  const withCode = item.code ? `${item.name} [${item.code}]` : item.name;
  const label = extras ? `${withCode} (${extras})` : withCode;
  const lineTotal = item.price * item.qty;
  return `${index + 1}. ${label} x ${item.qty} = ${formatInr(lineTotal)}`;
}

export function buildWhatsAppMessage(order: WhatsAppOrder): string {
  const lines = [
    "*New Diya Order*",
    `Order ID: ${order.orderId}`,
    `Name: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    `Pincode: ${order.pincode}`,
    "",
    "Items:",
    ...order.items.map(itemLine),
    "",
    `Total: ${formatInr(order.total)}`,
    "Cash on Delivery",
  ];

  return lines.join("\n");
}

export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
