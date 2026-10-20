import { listProducts } from "@/lib/db/catalog";
import { readSafely } from "@/lib/db/safe";
import { Products } from "@/types-db";

interface Query {
  size?: string;
  isFeatured?: boolean | string;
  origin?: string;
  category?: string;
}

const getProducts = (query: Query): Promise<Products[]> =>
  readSafely(
    "products",
    () =>
      listProducts({
        size: query.size,
        // Search params arrive as strings, e.g. ?isFeatured=true
        isFeatured: query.isFeatured === true || query.isFeatured === "true",
        origin: query.origin,
        category: query.category,
      }),
    []
  );

export default getProducts;
