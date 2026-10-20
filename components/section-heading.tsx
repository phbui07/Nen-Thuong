import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("space-y-3", align === "center" && "flex flex-col items-center")}>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-hero">{eyebrow}</p>}
        <h2 className="text-3xl font-bold text-neutral-800 md:text-4xl">{title}</h2>
        {description && <p className="max-w-2xl text-base leading-relaxed text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
