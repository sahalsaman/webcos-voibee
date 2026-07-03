import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@/lib/constants";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  partnerSlug?: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  return (session?.user as SessionUser) ?? null;
}

/** Redirect to /login if not signed in. */
export async function requireUser(callbackUrl?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(
      callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login",
    );
  }
  return user;
}

/** Redirect home if the signed-in user lacks one of the allowed roles. */
export async function requireRole(roles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/");
  return user;
}
