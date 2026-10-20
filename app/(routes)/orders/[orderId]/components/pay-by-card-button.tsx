"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";
import { CreditCard, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "react-hot-toast";
import { payOrderByCard } from "@/app/(routes)/checkout/actions";

export default function PayByCardButton({ orderId }: { orderId: string }) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const pay = () =>
    startTransition(async () => {
      const result = await payOrderByCard(orderId);
      if (result.ok) {
        window.location.href = result.redirectUrl;
      } else {
        toast.error(t.checkout.errors[result.error] ?? t.checkout.errors.failed);
      }
    });

  return (
    <Button onClick={pay} disabled={isPending} className="rounded-full bg-hero hover:bg-hero/90">
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
      {t.orders.payNow}
    </Button>
  );
}
