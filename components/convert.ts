// Formats a VND price for the given locale, e.g. "130.000 ₫" (vi-VN) or "₫130,000" (en-US).
export function formatPrice(price: number | string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}
