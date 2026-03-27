import { getUserById, type AuthUser } from "@property-lk/db";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";

export type AdminSessionUser = Omit<AuthUser, "passwordHash">;

export type AdminAccessState =
  | {
      kind: "authorized";
      user: AdminSessionUser;
    }
  | {
      kind: "unauthenticated";
    }
  | {
      kind: "forbidden";
      user: AdminSessionUser;
    };

export async function getAdminSessionUser(): Promise<AdminSessionUser | null> {
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

export async function getAdminAccessState(): Promise<AdminAccessState> {
  const user = await getAdminSessionUser();

  if (!user) {
    return {
      kind: "unauthenticated"
    };
  }

  if (user.role !== "ADMIN") {
    return {
      kind: "forbidden",
      user
    };
  }

  return {
    kind: "authorized",
    user
  };
}
