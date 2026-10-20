import type { Dictionary } from "@/lib/i18n/dictionaries";

// Maps an AdminActionResult error key to a translated message
export function adminErrorMessage(t: Dictionary, error: string) {
  const messages: Record<string, string> = {
    ...t.admin.products.errors,
    duplicate: t.admin.duplicate,
    required: t.admin.required,
    bankIncomplete: t.admin.settings.bankIncomplete,
    importFailed: t.admin.settings.importFailed,
    forbidden: t.admin.noAccessTitle,
  };
  return messages[error] ?? t.admin.actionFailed;
}
