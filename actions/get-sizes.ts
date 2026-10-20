import { listSizes } from "@/lib/db/catalog";
import { readSafely } from "@/lib/db/safe";
import { Size } from "@/types-db";

const getSizes = (): Promise<Size[]> => readSafely("sizes", listSizes, []);

export default getSizes;
