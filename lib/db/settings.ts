import type { StoreSettings } from "@/types-db";
import { query } from "./client";

const DEFAULT_SETTINGS: StoreSettings = {
  bankTransferEnabled: false,
  bankBin: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
  codEnabled: true,
};

export async function getStoreSettings(): Promise<StoreSettings> {
  const [row] = await query<{ value: Partial<StoreSettings> | string }>("SELECT value FROM settings WHERE key = 'store'");
  const value = typeof row?.value === "string" ? (JSON.parse(row.value) as Partial<StoreSettings>) : row?.value;
  return { ...DEFAULT_SETTINGS, ...value };
}

export async function saveStoreSettings(settings: StoreSettings) {
  await query(
    // Sent as text and converted by Postgres, so no driver JSON-encodes it twice
    `INSERT INTO settings (key, value) VALUES ('store', $1::text::jsonb)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value`,
    [JSON.stringify(settings)]
  );
}

// Bank transfer needs all of its details before it can be offered at checkout
export function hasBankDetails(settings: StoreSettings) {
  return Boolean(settings.bankBin && settings.accountNumber && settings.accountName);
}
