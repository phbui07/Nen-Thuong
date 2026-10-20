"use client";

import Container from "@/components/container";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";
import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="px-4 py-16 md:px-12">
      <EmptyState
        icon={TriangleAlert}
        title={t.status.errorTitle}
        description={t.status.errorText}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={reset} className="rounded-full bg-hero hover:bg-hero/90">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t.status.retry}
            </Button>
            <Button asChild variant={"outline"} className="rounded-full">
              <Link href="/">{t.status.backHome}</Link>
            </Button>
          </div>
        }
      />
    </Container>
  );
}
