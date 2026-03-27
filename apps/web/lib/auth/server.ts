import { getUserById, type AuthUser } from "@property-lk/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

export type SessionUser = Omit<AuthUser, "passwordHash">;

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session) {
    return null;
  }

  const user = await getUserById(session.sub);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function requireSessionUser(nextPath = "/account") {
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}
