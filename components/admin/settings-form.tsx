"use client";

import { importFromOldAdminAction, saveSettingsAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type { VietQrBank } from "@/lib/payments";
import { vietQrImageUrl } from "@/lib/vietqr";
import { useLanguage } from "@/providers/language-provider";
import type { StoreSettings } from "@/types-db";
import { CircleCheck, CreditCard, Download, Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { adminErrorMessage } from "./admin-errors";

interface SettingsFormProps {
  settings: StoreSettings;
  banks: VietQrBank[];
  stripeConfigured: boolean;
  canImport: boolean;
}

export default function SettingsForm({ settings, banks, stripeConfigured, canImport }: SettingsFormProps) {
  const { t } = useLanguage();
  const s = t.admin.settings;
  const router = useRouter();
  const [values, setValues] = useState(settings);
  const [isSaving, startSaving] = useTransition();
  const [isImporting, startImporting] = useTransition();
  const update = (changes: Partial<StoreSettings>) => setValues((current) => ({ ...current, ...changes }));
  const previewReady = Boolean(values.bankBin && values.accountNumber && values.accountName);

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    startSaving(async () => {
      const result = await saveSettingsAction(values);
      if (!result.ok) {
        toast.error(adminErrorMessage(t, result.error));
        return;
      }
      toast.success(t.admin.saved);
      router.refresh();
    });
  };

  const importData = () =>
    startImporting(async () => {
      const result = await importFromOldAdminAction();
      if (!result.ok) {
        toast.error(adminErrorMessage(t, result.error));
        return;
      }
      const [categories = 0, sizes = 0, products = 0] = result.counts ?? [];
      toast.success(s.importDone(categories, sizes, products));
      router.refresh();
    });

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="space-y-6">
        <section className="space-y-5 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm md:p-6">
          <h3 className="text-lg font-semibold text-neutral-800">{s.bankTitle}</h3>
          <label className="flex items-center gap-3 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={values.bankTransferEnabled}
              onChange={(event) => update({ bankTransferEnabled: event.target.checked })}
              className="h-4 w-4 accent-hero"
            />
            {s.bankEnable}
          </label>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {banks.length > 0 ? (
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-neutral-700">{s.bank}</span>
                  <Select
                    value={values.bankBin}
                    onChange={(event) => {
                      const bank = banks.find((item) => item.bin === event.target.value);
                      update({ bankBin: event.target.value, bankName: bank ? `${bank.shortName} – ${bank.name}` : "" });
                    }}
                  >
                    <option value="">{s.chooseBank}</option>
                    {banks.map((bank) => (
                      <option key={bank.bin} value={bank.bin}>
                        {bank.shortName} – {bank.name}
                      </option>
                    ))}
                  </Select>
                </label>
              ) : (
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-neutral-700">{s.bankBin}</span>
                  <Input
                    value={values.bankBin}
                    inputMode="numeric"
                    onChange={(event) => update({ bankBin: event.target.value.replace(/\D/g, "") })}
                  />
                  <span className="block text-xs text-muted-foreground">{s.bankListUnavailable}</span>
                </label>
              )}
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-neutral-700">{s.accountNumber}</span>
                <Input
                  value={values.accountNumber}
                  inputMode="numeric"
                  onChange={(event) => update({ accountNumber: event.target.value.replace(/\s/g, "") })}
                  maxLength={30}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-neutral-700">{s.accountName}</span>
                <Input
                  value={values.accountName}
                  onChange={(event) => update({ accountName: event.target.value.toUpperCase() })}
                  maxLength={60}
                />
                <span className="block text-xs text-muted-foreground">{s.accountNameHint}</span>
              </label>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">{s.preview}</p>
              {previewReady ? (
                // Live VietQR preview with a sample amount (external SVG)
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vietQrImageUrl(values, 100000, "NTMAU01")}
                  alt={s.preview}
                  width={480}
                  height={600}
                  className="w-full max-w-[240px] rounded-xl border border-neutral-100"
                />
              ) : (
                <p className="flex items-start gap-2 rounded-xl bg-cream p-4 text-sm text-neutral-600">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  {s.bankIncomplete}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm md:p-6">
          <h3 className="text-lg font-semibold text-neutral-800">{s.codTitle}</h3>
          <label className="flex items-center gap-3 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={values.codEnabled}
              onChange={(event) => update({ codEnabled: event.target.checked })}
              className="h-4 w-4 accent-hero"
            />
            {s.codEnable}
          </label>
        </section>

        <section className="space-y-3 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm md:p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-neutral-800">
            <CreditCard className="h-5 w-5 text-hero" />
            {s.stripeTitle}
          </h3>
          <p className={stripeConfigured ? "flex items-start gap-2 text-sm text-emerald-700" : "flex items-start gap-2 text-sm text-neutral-600"}>
            {stripeConfigured ? <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" /> : <Info className="mt-0.5 h-4 w-4 shrink-0" />}
            {stripeConfigured ? s.stripeOn : s.stripeOff}
          </p>
        </section>

        <Button type="submit" size="lg" disabled={isSaving} className="w-full rounded-full bg-hero hover:bg-hero/90 sm:w-auto sm:px-10">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? t.admin.saving : t.admin.save}
        </Button>
      </form>

      {canImport && (
        <section className="space-y-3 rounded-2xl border border-dashed border-neutral-200 p-5 md:p-6">
          <h3 className="text-lg font-semibold text-neutral-800">{s.importTitle}</h3>
          <p className="text-sm text-neutral-600">{s.importText}</p>
          <Button type="button" variant={"outline"} onClick={importData} disabled={isImporting} className="rounded-full">
            {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {isImporting ? s.importing : s.importButton}
          </Button>
        </section>
      )}
    </div>
  );
}
