import { fetchJson } from "@/lib/fetch-json";
import { Products } from "@/types-db";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  size?: string;
  isFeatured?: boolean;
  origin?: string;
  category?: string;
}

const getProducts = (query: Query): Promise<Products[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      size: query.size,
      isFeatured: query.isFeatured,
      origin: query.origin,
      category: query.category,
    },
  });
  return fetchJson<Products[]>(url, []);
};

export default getProducts;
