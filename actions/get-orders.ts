import { fetchJson } from "@/lib/fetch-json";
import { Orders } from "@/types-db";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/orders`;

const getOrders = (): Promise<Orders[]> => fetchJson<Orders[]>(URL, []);

export default getOrders;
