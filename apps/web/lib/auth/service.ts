import { createUser, getUserByEmail, isUniqueConstraintError, type AuthUser } from "@property-lk/db";
import { parseLoginInput, parseSignupInput } from "@property-lk/validation";
import { hashPassword, verifyPassword } from "./password";

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export async function loginWithPassword(input: { email?: string; password?: string }): Promise<AuthResult> {
  const parsed = parseLoginInput(input);
  const data = parsed.data;

  if (!parsed.ok || !data) {
    return {
      ok: false,
      message: "Enter a valid email and password.",
      fieldErrors: toFieldErrors(parsed.errors)
    };
  }

  const user = await getUserByEmail(data.email);

  if (!user || !verifyPassword(data.password, user.passwordHash)) {
    return {
      ok: false,
      message: "Incorrect email or password."
    };
  }

  return {
    ok: true,
    user
  };
}

export async function signupWithPassword(input: {
  name?: string;
  email?: string;
  password?: string;
}): Promise<AuthResult> {
  const parsed = parseSignupInput(input);
  const data = parsed.data;

  if (!parsed.ok || !data) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.errors)
    };
  }

  try {
    const user = await createUser({
      name: data.name,
      email: data.email,
      passwordHash: hashPassword(data.password)
    });

    return {
      ok: true,
      user: {
        id: user.id,
        name: user.name ?? undefined,
        email: user.email,
        role: user.role,
        passwordHash: user.passwordHash ?? undefined
      }
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        message: "An account with that email already exists.",
        fieldErrors: {
          email: "This email is already registered."
        }
      };
    }

    throw error;
  }
}

function toFieldErrors(
  errors: Array<{
    field: string;
    message: string;
  }>
) {
  return Object.fromEntries(errors.map((error) => [error.field, error.message]));
}
