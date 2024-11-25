import { cn } from "@/lib/utils";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function Container({ children, className }: ContainerProps) {
  return <div className={cn("mx-auto max-w-7xl", className)}>{children}</div>;
}
