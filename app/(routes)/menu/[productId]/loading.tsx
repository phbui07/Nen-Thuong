import Container from "@/components/container";

export default function ProductLoading() {
  return (
    <Container className="px-4 pb-16 pt-8 md:px-12">
      <div className="h-4 w-56 animate-pulse rounded-full bg-neutral-100" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="aspect-square animate-pulse rounded-2xl bg-cream" />
        <div className="space-y-5">
          <div className="h-10 w-2/3 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-7 w-1/3 animate-pulse rounded-full bg-neutral-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-12 animate-pulse rounded-full bg-neutral-100" />
        </div>
      </div>
    </Container>
  );
}
