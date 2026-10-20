import { listCategories } from "@/lib/db/catalog";
import { readSafely } from "@/lib/db/safe";
import { Category } from "@/types-db";

const getCategories = (): Promise<Category[]> => readSafely("categories", listCategories, []);

export default getCategories;
