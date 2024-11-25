import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Box from "@/components/box";
import Container from "@/components/container";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import Gallery from "./components/gallery/gallery";
import Info from "./components/info";
import SuggestedList from "./components/suggested-list";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.productId);
  const suggestedProduct = await getProducts({ category: product.category });
  return (
    <div>
      <Container className="bg-white rounded-lg my-4">
        <Box className="text-neutral-700 text-sm items-center mt-12">
          <Link href={"/"} className="flex items-center gap-2">
            <Home className="w-5 h-5" /> Main Page
          </Link>
          <ChevronRight className="h-5 ư-5 text-muted-foreground" />
          <Link
            href={"/menu"}
            className="flex items-center gap-2 text-muted-foreground"
          >
            Products
          </Link>
        </Box>
        <div className="px-4 py-10 sm:px-6 lg:px-10 space-y-10">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Gallery section */}
            <Gallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              {/* Info Section */}
              <Info product={product} />
            </div>
          </div>
          <SuggestedList products={suggestedProduct}/>
        </div>
      </Container>
    </div>
  );
}
