import { Products } from "@/types-db";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  size?: string;
  isFeatured?: boolean;
  origin?: string;
  category?: string;
}

const getProducts = async (query: Query): Promise<Products[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      size: query.size,
      isFeatured: query.isFeatured,
      origin: query.origin,
      category: query.category,
    },
  });
  const res = await fetch(url);
  return res.json();
};

export default getProducts;
