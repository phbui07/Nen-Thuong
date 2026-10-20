import { fetchJson } from "@/lib/fetch-json";
import { Products } from "@/types-db";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = (id: string): Promise<Products | null> =>
  fetchJson<Products | null>(`${URL}/${id}`, null);

export default getProduct;
