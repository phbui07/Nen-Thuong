"use server";

import { NotAdminError, assertAdmin } from "@/lib/auth";
import {
  deleteCategory,
  deleteProduct,
  deleteSize,
  isDuplicateError,
  saveCategory,
  saveProduct,
  saveSize,
  type ProductInput,
} from "@/lib/db/catalog";
import { query } from "@/lib/db/client";
import { IMAGE_URL_PREFIX } from "@/lib/db/images";
import { updateOrder } from "@/lib/db/orders";
import { hasBankDetails, saveStoreSettings } from "@/lib/db/settings";
import { fetchJson } from "@/lib/fetch-json";
import { ORDER_STATUSES, type OrderStatus, type StoreSettings } from "@/types-db";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

// `error` is a dictionary key the admin UI translates
export type AdminActionResult = { ok: true; id?: string; counts?: number[] } | { ok: false; error: string };

// Every action re-checks admin access: the layout check alone isn't a security boundary
async function adminAction(work: () => Promise<AdminActionResult>): Promise<AdminActionResult> {
  try {
    await assertAdmin();
    const result = await work();
    // Store pages are rendered per request; this refreshes cached client views
    if (result.ok) revalidatePath("/", "layout");
    return result;
  } catch (error) {
    if (error instanceof NotAdminError) return { ok: false, error: "forbidden" };
    if (isDuplicateError(error)) return { ok: false, error: "duplicate" };
    console.error("Admin action failed:", error);
    return { ok: false, error: "actionFailed" };
  }
}

const text = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export async function saveProductAction(id: string | null, input: ProductInput) {
  return adminAction(async () => {
    const name = text(input.name, 120);
    const price = Number(input.price);
    if (!name) return { ok: false, error: "name" };
    if (!Number.isInteger(price) || price < 0 || price > 100_000_000) return { ok: false, error: "price" };
    const images = (Array.isArray(input.images) ? input.images : [])
      .filter((url): url is string => typeof url === "string")
      .filter((url) => url.startsWith(IMAGE_URL_PREFIX) || url.startsWith("https://"))
      .slice(0, 10);

    const savedId = await saveProduct(id, {
      name,
      description: text(input.description, 2000),
      price,
      categoryId: input.categoryId || null,
      sizeId: input.sizeId || null,
      origin: text(input.origin, 80),
      isFeatured: Boolean(input.isFeatured),
      isArchived: Boolean(input.isArchived),
      images,
    });
    return { ok: true, id: savedId };
  });
}

export async function deleteProductAction(id: string) {
  return adminAction(async () => {
    await deleteProduct(id);
    return { ok: true };
  });
}

export async function saveCategoryAction(id: string | null, name: string) {
  return adminAction(async () => {
    const value = text(name, 60);
    if (!value) return { ok: false, error: "required" };
    await saveCategory(id, value);
    return { ok: true };
  });
}

export async function deleteCategoryAction(id: string) {
  return adminAction(async () => {
    await deleteCategory(id);
    return { ok: true };
  });
}

export async function saveSizeAction(id: string | null, name: string, value: string) {
  return adminAction(async () => {
    const label = text(name, 30);
    if (!label) return { ok: false, error: "required" };
    await saveSize(id, label, text(value, 30));
    return { ok: true };
  });
}

export async function deleteSizeAction(id: string) {
  return adminAction(async () => {
    await deleteSize(id);
    return { ok: true };
  });
}

export async function updateOrderAction(id: string, changes: { status: OrderStatus; isPaid: boolean }) {
  return adminAction(async () => {
    if (!ORDER_STATUSES.includes(changes.status)) return { ok: false, error: "actionFailed" };
    await updateOrder(id, { status: changes.status, isPaid: Boolean(changes.isPaid) });
    return { ok: true };
  });
}

export async function saveSettingsAction(input: StoreSettings) {
  return adminAction(async () => {
    const settings: StoreSettings = {
      bankTransferEnabled: Boolean(input.bankTransferEnabled),
      bankBin: text(input.bankBin, 10).replace(/\D/g, ""),
      bankName: text(input.bankName, 80),
      accountNumber: text(input.accountNumber, 30).replace(/\s/g, ""),
      accountName: text(input.accountName, 60).toUpperCase(),
      codEnabled: Boolean(input.codEnabled),
    };
    if (settings.bankTransferEnabled && !hasBankDetails(settings)) return { ok: false, error: "bankIncomplete" };
    await saveStoreSettings(settings);
    return { ok: true };
  });
}

interface OldProduct {
  name?: string;
  price?: number | string;
  description?: string;
  images?: { url?: string }[];
  isFeatured?: boolean;
  isArchived?: boolean;
  category?: string;
  size?: string;
  origin?: string;
}

// Copies the catalog from the old admin's public API (if it's ever back online)
export async function importFromOldAdminAction() {
  return adminAction(async () => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return { ok: false, error: "importFailed" };
    const [categories, sizes, products] = await Promise.all([
      fetchJson<{ name?: string }[] | null>(`${base}/categories`, null),
      fetchJson<{ name?: string; value?: string }[] | null>(`${base}/sizes`, null),
      fetchJson<OldProduct[] | null>(`${base}/products`, null),
    ]);
    if (!Array.isArray(categories) || !Array.isArray(sizes) || !Array.isArray(products)) {
      return { ok: false, error: "importFailed" };
    }

    let addedCategories = 0;
    let addedSizes = 0;
    let addedProducts = 0;
    for (const category of categories) {
      const name = text(category.name, 60);
      if (!name) continue;
      const rows = await query("INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING RETURNING id", [randomUUID(), name]);
      addedCategories += rows.length;
    }
    for (const size of sizes) {
      const name = text(size.name, 30);
      if (!name) continue;
      const rows = await query("INSERT INTO sizes (id, name, value) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING RETURNING id", [randomUUID(), name, text(size.value, 30)]);
      addedSizes += rows.length;
    }

    const categoryIds = new Map((await query<{ id: string; name: string }>("SELECT id, name FROM categories")).map((row) => [row.name, row.id]));
    const sizeIds = new Map((await query<{ id: string; name: string }>("SELECT id, name FROM sizes")).map((row) => [row.name, row.id]));
    const existing = new Set((await query<{ name: string }>("SELECT name FROM products")).map((row) => row.name));

    for (const product of products) {
      const name = text(product.name, 120);
      const price = Math.round(Number(product.price));
      // Skip products that are already here, so importing twice is harmless
      if (!name || existing.has(name) || !Number.isFinite(price) || price < 0) continue;
      await saveProduct(null, {
        name,
        description: text(product.description, 2000),
        price,
        categoryId: categoryIds.get(text(product.category, 60)) ?? null,
        sizeId: sizeIds.get(text(product.size, 30)) ?? null,
        origin: text(product.origin, 80),
        isFeatured: Boolean(product.isFeatured),
        isArchived: Boolean(product.isArchived),
        images: (product.images ?? []).map((image) => String(image.url ?? "")).filter((url) => url.startsWith("https://")).slice(0, 10),
      });
      existing.add(name);
      addedProducts += 1;
    }
    return { ok: true, counts: [addedCategories, addedSizes, addedProducts] };
  });
}
