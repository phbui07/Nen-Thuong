import NameListManager from "@/components/admin/name-list-manager";
import { requireAdminPage } from "@/lib/admin-guard";
import { listCategories } from "@/lib/db/catalog";
import { getDictionary } from "@/lib/i18n/server";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  await requireAdminPage();
  const [t, items] = await Promise.all([getDictionary(), listCategories()]);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-neutral-800">{t.admin.categories.title}</h2>
        <p className="text-sm text-muted-foreground">{t.admin.categories.text}</p>
      </div>
      <NameListManager kind="category" items={items} />
    </div>
  );
}
