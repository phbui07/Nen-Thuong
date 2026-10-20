import Container from "@/components/container";
import ProductGridSkeleton from "@/components/product-grid-skeleton";

export default function MenuLoading() {
  return (
    <Container className="px-4 pb-16 pt-8 md:px-12">
      <div className="h-4 w-40 animate-pulse rounded-full bg-neutral-100" />
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="hidden space-y-3 md:col-span-3 md:block lg:col-span-2">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-8 animate-pulse rounded-lg bg-neutral-100" />
          ))}
        </div>
        <div className="space-y-6 md:col-span-9 lg:col-span-10">
          <div className="h-8 w-56 animate-pulse rounded-full bg-neutral-100" />
          <ProductGridSkeleton />
        </div>
      </div>
    </Container>
  );
}
