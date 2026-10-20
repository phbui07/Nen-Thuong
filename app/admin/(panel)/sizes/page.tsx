import NameListManager from "@/components/admin/name-list-manager";
import { requireAdminPage } from "@/lib/admin-guard";
import { listSizes } from "@/lib/db/catalog";
import { getDictionary } from "@/lib/i18n/server";

export const revalidate = 0;

export default async function AdminSizesPage() {
  await requireAdminPage();
  const [t, items] = await Promise.all([getDictionary(), listSizes()]);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-neutral-800">{t.admin.sizes.title}</h2>
        <p className="text-sm text-muted-foreground">{t.admin.sizes.text}</p>
      </div>
      <NameListManager kind="size" items={items} />
    </div>
  );
}
