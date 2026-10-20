import { fetchJson } from "@/lib/fetch-json";
import { Kitchen } from "@/types-db";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/kitchens`;

const getKitchens = (): Promise<Kitchen[]> => fetchJson<Kitchen[]>(URL, []);

export default getKitchens;
