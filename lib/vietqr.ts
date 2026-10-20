import type { StoreSettings } from "@/types-db";

// VietQR image with the amount and order code filled in, scannable by Vietnamese banking apps
export function vietQrImageUrl(
  settings: Pick<StoreSettings, "bankBin" | "accountNumber" | "accountName">,
  amount: number,
  code: string
) {
  const params = new URLSearchParams({ amount: String(amount), addInfo: code, accountName: settings.accountName });
  return `https://img.vietqr.io/image/${encodeURIComponent(settings.bankBin)}-${encodeURIComponent(
    settings.accountNumber
  )}-compact2.svg?${params}`;
}
