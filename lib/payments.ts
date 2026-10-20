import type { PaymentMethod, StoreSettings } from "@/types-db";
import Stripe from "stripe";
import { hasBankDetails } from "./db/settings";

export { vietQrImageUrl } from "./vietqr";

// Card payments switch on automatically once STRIPE_SECRET_KEY is set.
export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
  stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}

export function availablePaymentMethods(settings: StoreSettings): PaymentMethod[] {
  const methods: PaymentMethod[] = [];
  if (settings.bankTransferEnabled && hasBankDetails(settings)) methods.push("bank_transfer");
  if (settings.codEnabled) methods.push("cod");
  if (isStripeConfigured()) methods.push("stripe");
  return methods;
}

export interface VietQrBank {
  bin: string;
  shortName: string;
  name: string;
  logo: string;
}

// Banks that support VietQR transfers, for the settings dropdown (cached for a day)
export async function listVietQrBanks(): Promise<VietQrBank[]> {
  try {
    const res = await fetch("https://api.vietqr.io/v2/banks", { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const body = (await res.json()) as { data?: (VietQrBank & { transferSupported?: number })[] };
    return (body.data ?? [])
      .filter((bank) => bank.transferSupported)
      .map(({ bin, shortName, name, logo }) => ({ bin, shortName, name, logo }));
  } catch (error) {
    console.error("Could not load the VietQR bank list:", error);
    return [];
  }
}
