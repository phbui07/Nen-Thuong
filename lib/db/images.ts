import { randomUUID } from "node:crypto";
import { query } from "./client";

// Product photos are stored in the database, so no separate file storage is needed.
export const IMAGE_URL_PREFIX = "/api/images/";
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function saveImage(contentType: string, data: Buffer): Promise<string> {
  const id = randomUUID();
  await query("INSERT INTO images (id, content_type, data) VALUES ($1, $2, $3)", [id, contentType, data]);
  return `${IMAGE_URL_PREFIX}${id}`;
}

export async function getImage(id: string) {
  const [row] = await query<{ content_type: string; data: Uint8Array }>(
    "SELECT content_type, data FROM images WHERE id = $1",
    [id]
  );
  return row ?? null;
}

// Removes uploaded photos that no product uses any more. Photos uploaded in
// the last day are kept, because a product form may still be open with them.
export async function deleteUnusedImages() {
  await query(
    `DELETE FROM images i
      WHERE i.created_at < now() - interval '1 day'
        AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = $1 || i.id)
        AND NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.image_url = $1 || i.id)`,
    [IMAGE_URL_PREFIX]
  );
}
