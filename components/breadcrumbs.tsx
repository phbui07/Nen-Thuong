import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  label: string;
  items: Crumb[];
}

export default function Breadcrumbs({ label, items }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li key={`${index}-${item.label}`} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="flex items-center gap-1.5 transition-colors hover:text-hero">
                {index === 0 && <Home className="h-4 w-4" aria-hidden />}
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="max-w-[14rem] truncate font-medium text-neutral-700">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
