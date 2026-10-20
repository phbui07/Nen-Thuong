import { getProductById } from "@/lib/db/catalog";
import { readSafely } from "@/lib/db/safe";
import { Products } from "@/types-db";

const getProduct = (id: string): Promise<Products | null> =>
  readSafely(`product ${id}`, () => getProductById(id), null);

export default getProduct;
