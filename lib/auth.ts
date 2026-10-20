import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";

// Admins can be changed without a code change by setting ADMIN_EMAILS
// (comma-separated) in the environment.
const DEFAULT_ADMIN_EMAILS = ["ph.bui07@gmail.com"];

export function getAdminEmails(): string[] {
  const fromEnv = process.env.ADMIN_EMAILS?.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_ADMIN_EMAILS;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  // Only verified addresses count, so nobody can claim an admin email at sign-up
  verifiedEmails: string[];
}

// The signed-in user's id, without fetching their profile from Clerk
export const getUserId = cache(async (): Promise<string | null> => (await auth()).userId);

// Cached per request, so pages, layouts and actions share one Clerk lookup
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const userId = await getUserId();
  if (!userId) return null;
  const user = await currentUser();
  if (!user) return null;
  const primary = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId);
  return {
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    email: primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "",
    verifiedEmails: user.emailAddresses
      .filter((email) => email.verification?.status === "verified")
      .map((email) => email.emailAddress.toLowerCase()),
  };
});

export const isAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  const admins = getAdminEmails();
  return user.verifiedEmails.some((email) => admins.includes(email));
});

export class NotAdminError extends Error {
  constructor() {
    super("Admin access required");
    this.name = "NotAdminError";
  }
}

// For server actions and API routes: pages redirect instead (see admin layout).
export async function assertAdmin() {
  if (!(await isAdmin())) throw new NotAdminError();
}
