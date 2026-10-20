import { fetchJson } from "@/lib/fetch-json";
import { Origin } from "@/types-db";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/origins`;

const getOrigins = (): Promise<Origin[]> => fetchJson<Origin[]>(URL, []);

export default getOrigins;
