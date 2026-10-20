// Placeholder cards shown while product data loads
export default function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
          <div className="aspect-square animate-pulse bg-cream" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-neutral-100" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-neutral-100" />
            <div className="h-8 w-full animate-pulse rounded-full bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
