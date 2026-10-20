import { randomUUID } from "node:crypto";
import type { Category, Products, Size } from "@/types-db";
import { query, transaction } from "./client";
import { deleteUnusedImages } from "./images";

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  category: string | null;
  size_id: string | null;
  size: string | null;
  origin: string;
  is_featured: boolean;
  is_archived: boolean;
  images: string[] | null;
}

const PRODUCT_SELECT = `
  SELECT p.id, p.name, p.description, p.price, p.category_id, c.name AS category,
         p.size_id, s.name AS size, p.origin, p.is_featured, p.is_archived,
         (SELECT coalesce(json_agg(pi.url ORDER BY pi.position), '[]'::json)
            FROM product_images pi WHERE pi.product_id = p.id) AS images
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN sizes s ON s.id = p.size_id`;

function toProduct(row: ProductRow): Products {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category ?? "",
    categoryId: row.category_id,
    size: row.size ?? "",
    sizeId: row.size_id,
    origin: row.origin,
    isFeatured: row.is_featured,
    isArchived: row.is_archived,
    images: (row.images ?? []).map((url) => ({ url })),
    qty: 1,
  };
}

export interface ProductFilters {
  category?: string;
  size?: string;
  origin?: string;
  isFeatured?: boolean;
  includeArchived?: boolean;
}

export async function listProducts(filters: ProductFilters = {}): Promise<Products[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, value: unknown) => {
    params.push(value);
    conditions.push(sql.replace("?", `$${params.length}`));
  };
  if (!filters.includeArchived) conditions.push("p.is_archived = false");
  if (filters.category) add("c.name = ?", filters.category);
  if (filters.size) add("s.name = ?", filters.size);
  if (filters.origin) add("p.origin = ?", filters.origin);
  if (filters.isFeatured) conditions.push("p.is_featured = true");

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await query<ProductRow>(`${PRODUCT_SELECT} ${where} ORDER BY p.created_at DESC`, params);
  return rows.map(toProduct);
}

export async function getProductById(id: string, { includeArchived = false } = {}): Promise<Products | null> {
  const rows = await query<ProductRow>(
    `${PRODUCT_SELECT} WHERE p.id = $1 ${includeArchived ? "" : "AND p.is_archived = false"}`,
    [id]
  );
  return rows[0] ? toProduct(rows[0]) : null;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  categoryId: string | null;
  sizeId: string | null;
  origin: string;
  isFeatured: boolean;
  isArchived: boolean;
  images: string[];
}

export async function saveProduct(id: string | null, input: ProductInput): Promise<string> {
  const productId = id ?? randomUUID();
  await transaction(async (tx) => {
    const values = [
      input.name,
      input.description,
      input.price,
      input.categoryId,
      input.sizeId,
      input.origin,
      input.isFeatured,
      input.isArchived,
      productId,
    ];
    if (id) {
      await tx.query(
        `UPDATE products SET name = $1, description = $2, price = $3, category_id = $4, size_id = $5,
                origin = $6, is_featured = $7, is_archived = $8, updated_at = now()
          WHERE id = $9`,
        values
      );
      await tx.query("DELETE FROM product_images WHERE product_id = $1", [productId]);
    } else {
      await tx.query(
        `INSERT INTO products (name, description, price, category_id, size_id, origin, is_featured, is_archived, id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        values
      );
    }
    for (const [position, url] of input.images.entries()) {
      await tx.query("INSERT INTO product_images (product_id, position, url) VALUES ($1, $2, $3)", [
        productId,
        position,
        url,
      ]);
    }
  });
  await deleteUnusedImages();
  return productId;
}

export async function deleteProduct(id: string) {
  await query("DELETE FROM products WHERE id = $1", [id]);
  await deleteUnusedImages();
}

export async function countProducts() {
  const [row] = await query<{ total: number; active: number }>(
    "SELECT count(*)::int AS total, count(*) FILTER (WHERE NOT is_archived)::int AS active FROM products"
  );
  return row;
}

export async function listCategories(): Promise<Category[]> {
  return query<Category>(
    `SELECT c.id, c.name, count(p.id)::int AS "productCount"
       FROM categories c LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id ORDER BY c.name`
  );
}

export async function listSizes(): Promise<Size[]> {
  return query<Size>(
    `SELECT s.id, s.name, s.value, count(p.id)::int AS "productCount"
       FROM sizes s LEFT JOIN products p ON p.size_id = s.id
      GROUP BY s.id ORDER BY s.name`
  );
}

export async function saveCategory(id: string | null, name: string) {
  if (id) {
    await query("UPDATE categories SET name = $1 WHERE id = $2", [name, id]);
  } else {
    await query("INSERT INTO categories (id, name) VALUES ($1, $2)", [randomUUID(), name]);
  }
}

export async function deleteCategory(id: string) {
  await query("DELETE FROM categories WHERE id = $1", [id]);
}

export async function saveSize(id: string | null, name: string, value: string) {
  if (id) {
    await query("UPDATE sizes SET name = $1, value = $2 WHERE id = $3", [name, value, id]);
  } else {
    await query("INSERT INTO sizes (id, name, value) VALUES ($1, $2, $3)", [randomUUID(), name, value]);
  }
}

export async function deleteSize(id: string) {
  await query("DELETE FROM sizes WHERE id = $1", [id]);
}

// Postgres unique-violation error code, e.g. a category name that already exists
export function isDuplicateError(error: unknown) {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "23505";
}
