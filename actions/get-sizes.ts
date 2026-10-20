import { fetchJson } from "@/lib/fetch-json";
import { Size } from "@/types-db";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`;

const getSizes = (): Promise<Size[]> => fetchJson<Size[]>(URL, []);

export default getSizes;
