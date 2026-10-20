import { randomInt, randomUUID } from "node:crypto";
import type { OrderItem, OrderStatus, Orders, PaymentMethod } from "@/types-db";
import { isDuplicateError } from "./catalog";
import { query, transaction } from "./client";

interface OrderRow {
  id: string;
  code: string;
  user_id: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  payment_method: PaymentMethod;
  is_paid: boolean;
  status: OrderStatus;
  total: number;
  stripe_session_id: string | null;
  created_at: Date | string;
  items: { productId: string | null; name: string; price: number; qty: number; imageUrl: string }[] | null;
}

const ORDER_SELECT = `
  SELECT o.*,
         (SELECT coalesce(json_agg(json_build_object(
                   'productId', oi.product_id, 'name', oi.name, 'price', oi.price,
                   'qty', oi.qty, 'imageUrl', oi.image_url) ORDER BY oi.position), '[]'::json)
            FROM order_items oi WHERE oi.order_id = o.id) AS items
    FROM orders o`;

function toOrder(row: OrderRow): Orders {
  return {
    id: row.id,
    code: row.code,
    userId: row.user_id,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    note: row.note,
    paymentMethod: row.payment_method,
    isPaid: row.is_paid,
    status: row.status,
    total: Number(row.total),
    stripeSessionId: row.stripe_session_id,
    createdAt: new Date(row.created_at).toISOString(),
    items: (row.items ?? []).map((item) => ({ ...item, price: Number(item.price), qty: Number(item.qty) })),
  };
}

export class ProductUnavailableError extends Error {
  constructor() {
    super("One or more products are no longer available");
    this.name = "ProductUnavailableError";
  }
}

// Short, readable code customers put in their bank transfer, e.g. NT7K2QX9
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function orderCode() {
  return "NT" + Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

export interface NewOrder {
  userId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  paymentMethod: PaymentMethod;
  items: { productId: string; qty: number }[];
}

// Prices and names always come from the database, never from the browser.
export async function createOrder(input: NewOrder): Promise<Orders> {
  const id = randomUUID();
  for (let attempt = 0; ; attempt++) {
    try {
      await transaction(async (tx) => {
        const products = await tx.query<{ id: string; name: string; price: number; image: string | null }>(
          `SELECT p.id, p.name, p.price,
                  (SELECT url FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) AS image
             FROM products p
            WHERE p.id = ANY($1::text[]) AND p.is_archived = false`,
          [input.items.map((item) => item.productId)]
        );
        const byId = new Map(products.map((product) => [product.id, product]));
        const lines: OrderItem[] = input.items.map((item) => {
          const product = byId.get(item.productId);
          if (!product) throw new ProductUnavailableError();
          return {
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            qty: item.qty,
            imageUrl: product.image ?? "",
          };
        });
        const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0);

        await tx.query(
          `INSERT INTO orders (id, code, user_id, customer_name, phone, email, address, note, payment_method, total)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [id, orderCode(), input.userId, input.customerName, input.phone, input.email, input.address, input.note, input.paymentMethod, total]
        );
        for (const [position, line] of lines.entries()) {
          await tx.query(
            `INSERT INTO order_items (order_id, position, product_id, name, price, qty, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, position, line.productId, line.name, line.price, line.qty, line.imageUrl]
          );
        }
      });
      break;
    } catch (error) {
      // Retry with a new code in the rare case two orders get the same one
      if (isDuplicateError(error) && attempt < 3) continue;
      throw error;
    }
  }
  return (await getOrder(id))!;
}

export async function getOrder(id: string): Promise<Orders | null> {
  const rows = await query<OrderRow>(`${ORDER_SELECT} WHERE o.id = $1`, [id]);
  return rows[0] ? toOrder(rows[0]) : null;
}

export async function listOrdersByUser(userId: string): Promise<Orders[]> {
  const rows = await query<OrderRow>(`${ORDER_SELECT} WHERE o.user_id = $1 ORDER BY o.created_at DESC`, [userId]);
  return rows.map(toOrder);
}

export async function listOrders({ status, limit }: { status?: OrderStatus; limit?: number } = {}): Promise<Orders[]> {
  const params: unknown[] = [];
  let where = "";
  if (status) {
    params.push(status);
    where = "WHERE o.status = $1";
  }
  const rows = await query<OrderRow>(
    `${ORDER_SELECT} ${where} ORDER BY o.created_at DESC ${limit ? `LIMIT ${Math.floor(limit)}` : ""}`,
    params
  );
  return rows.map(toOrder);
}

export async function updateOrder(id: string, changes: { status?: OrderStatus; isPaid?: boolean }) {
  await query(
    `UPDATE orders SET status = coalesce($2, status), is_paid = coalesce($3, is_paid), updated_at = now()
      WHERE id = $1`,
    [id, changes.status ?? null, changes.isPaid ?? null]
  );
}

export async function setStripeSession(id: string, sessionId: string) {
  await query("UPDATE orders SET stripe_session_id = $2, updated_at = now() WHERE id = $1", [id, sessionId]);
}

export async function markPaidByStripeSession(sessionId: string) {
  await query("UPDATE orders SET is_paid = true, updated_at = now() WHERE stripe_session_id = $1", [sessionId]);
}

export async function orderStats() {
  const [row] = await query<{ revenue: number; orders: number; open: number; unpaid: number }>(
    `SELECT coalesce(sum(total) FILTER (WHERE is_paid), 0)::int AS revenue,
            count(*)::int AS orders,
            count(*) FILTER (WHERE status IN ('Processing', 'Delivering'))::int AS open,
            count(*) FILTER (WHERE NOT is_paid AND status <> 'Canceled')::int AS unpaid
       FROM orders`
  );
  return row;
}
