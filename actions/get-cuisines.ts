import { fetchJson } from "@/lib/fetch-json";
import { Cuisines } from "@/types-db";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/cuisines`;

const getCuisines = (): Promise<Cuisines[]> => fetchJson<Cuisines[]>(URL, []);

export default getCuisines;
