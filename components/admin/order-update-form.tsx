"use client";

import { updateOrderAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { useLanguage } from "@/providers/language-provider";
import { ORDER_STATUSES, type OrderStatus } from "@/types-db";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "react-hot-toast";
import { adminErrorMessage } from "./admin-errors";

interface OrderUpdateFormProps {
  orderId: string;
  status: OrderStatus;
  isPaid: boolean;
}

export default function OrderUpdateForm({ orderId, status, isPaid }: OrderUpdateFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateOrderAction(orderId, {
        status: String(form.get("status")) as OrderStatus,
        isPaid: form.get("isPaid") === "on",
      });
      if (!result.ok) {
        toast.error(adminErrorMessage(t, result.error));
        return;
      }
      toast.success(t.admin.orders.updated);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-neutral-800">{t.admin.orders.update}</h3>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-neutral-700">{t.admin.orders.status}</span>
        <Select name="status" defaultValue={status}>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {t.orders.statuses[value]}
            </option>
          ))}
        </Select>
      </label>
      <label className="flex items-center gap-3 text-sm text-neutral-700">
        <input type="checkbox" name="isPaid" defaultChecked={isPaid} className="h-4 w-4 accent-hero" />
        {t.admin.orders.paid}
      </label>
      <Button type="submit" disabled={isPending} className="w-full rounded-full bg-hero hover:bg-hero/90">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? t.admin.saving : t.admin.save}
      </Button>
    </form>
  );
}
