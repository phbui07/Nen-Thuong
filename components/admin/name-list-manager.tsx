"use client";

import {
  deleteCategoryAction,
  deleteSizeAction,
  saveCategoryAction,
  saveSizeAction,
  type AdminActionResult,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/providers/language-provider";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { adminErrorMessage } from "./admin-errors";

interface ListItem {
  id: string;
  name: string;
  value?: string;
  productCount?: number;
}

interface NameListManagerProps {
  // Sizes also have a value (e.g. "100" for "100ml")
  kind: "category" | "size";
  items: ListItem[];
}

export default function NameListManager({ kind, items }: NameListManagerProps) {
  const { t } = useLanguage();
  const copy = kind === "category" ? t.admin.categories : t.admin.sizes;
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<AdminActionResult>, success: string, after?: () => void) =>
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(adminErrorMessage(t, result.error));
        return;
      }
      toast.success(success);
      after?.();
      router.refresh();
    });

  const save = (id: string | null, form: FormData, after: () => void) => {
    const name = String(form.get("name") ?? "");
    const value = String(form.get("value") ?? "");
    run(() => (kind === "category" ? saveCategoryAction(id, name) : saveSizeAction(id, name, value)), t.admin.saved, after);
  };

  const remove = (item: ListItem) => {
    if (!window.confirm(t.admin.confirmDelete(item.name))) return;
    run(() => (kind === "category" ? deleteCategoryAction(item.id) : deleteSizeAction(item.id)), t.admin.deleted);
  };

  const fields = (item?: ListItem) => (
    <>
      <Input
        name="name"
        defaultValue={item?.name}
        placeholder={kind === "category" ? t.admin.categories.placeholder : t.admin.sizes.namePlaceholder}
        aria-label={kind === "category" ? t.admin.categories.placeholder : t.admin.sizes.namePlaceholder}
        required
        maxLength={kind === "category" ? 60 : 30}
        className="min-w-0 flex-1"
      />
      {kind === "size" && (
        <Input
          name="value"
          defaultValue={item?.value}
          placeholder={t.admin.sizes.valuePlaceholder}
          aria-label={t.admin.sizes.valuePlaceholder}
          maxLength={30}
          className="min-w-0 flex-1 sm:max-w-[10rem]"
        />
      )}
    </>
  );

  return (
    <div className="space-y-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          save(null, new FormData(form), () => form.reset());
        }}
        className="flex flex-col gap-2 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm sm:flex-row"
      >
        {fields()}
        <Button type="submit" disabled={isPending} className="rounded-lg bg-hero hover:bg-hero/90">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          {t.admin.add}
        </Button>
      </form>

      {items.length === 0 ? (
        <p className="rounded-2xl bg-cream p-6 text-center text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-3">
              {editingId === item.id ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    save(item.id, new FormData(event.currentTarget), () => setEditingId(null));
                  }}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  {fields(item)}
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isPending} className="flex-1 rounded-lg bg-hero hover:bg-hero/90">
                      {t.admin.save}
                    </Button>
                    <Button type="button" variant={"ghost"} onClick={() => setEditingId(null)} className="flex-1 rounded-lg">
                      {t.admin.cancel}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-800">
                      {item.name}
                      {item.value && <span className="ml-2 text-sm font-normal text-muted-foreground">({item.value})</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{copy.count(item.productCount ?? 0)}</p>
                  </div>
                  <Button
                    type="button"
                    size={"icon"}
                    variant={"ghost"}
                    onClick={() => setEditingId(item.id)}
                    aria-label={`${t.admin.edit} ${item.name}`}
                    className="h-9 w-9 text-muted-foreground hover:text-hero"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size={"icon"}
                    variant={"ghost"}
                    onClick={() => remove(item)}
                    disabled={isPending}
                    aria-label={`${t.admin.delete} ${item.name}`}
                    className="h-9 w-9 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
