import { cn } from "@/lib/utils";

interface FilterContainerProps {
  children: React.ReactNode;
  className?: string;
}

const FilterContainer = ({ children, className }: FilterContainerProps) => {
  return <div className={cn("flex flex-col gap-6", className)}>{children}</div>;
};

export default FilterContainer;
