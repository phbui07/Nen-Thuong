import SettingsForm from "@/components/admin/settings-form";
import { requireAdminPage } from "@/lib/admin-guard";
import { getStoreSettings } from "@/lib/db/settings";
import { getDictionary } from "@/lib/i18n/server";
import { isStripeConfigured, listVietQrBanks } from "@/lib/payments";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  await requireAdminPage();
  const [t, settings, banks] = await Promise.all([getDictionary(), getStoreSettings(), listVietQrBanks()]);

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-800">{t.admin.settings.title}</h2>
      <SettingsForm
        settings={settings}
        banks={banks}
        stripeConfigured={isStripeConfigured()}
        canImport={Boolean(process.env.NEXT_PUBLIC_API_URL)}
      />
    </div>
  );
}
