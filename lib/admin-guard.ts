import { isAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db/client";
import { redirect } from "next/navigation";

// For admin pages. Server actions check again with assertAdmin().
export async function requireAdminPage() {
  if (!(await isAdmin())) redirect("/admin/no-access");
  if (!isDatabaseConfigured()) redirect("/admin/setup");
}
