import { fetchJson } from "@/lib/fetch-json";
import { Category } from "@/types-db";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = (): Promise<Category[]> => fetchJson<Category[]>(URL, []);

export default getCategories;
