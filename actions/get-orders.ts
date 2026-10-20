import { listOrdersByUser } from "@/lib/db/orders";
import { readSafely } from "@/lib/db/safe";
import { Orders } from "@/types-db";

// Only the signed-in customer's own orders are loaded
const getOrders = (userId: string): Promise<Orders[]> => readSafely("orders", () => listOrdersByUser(userId), []);

export default getOrders;
