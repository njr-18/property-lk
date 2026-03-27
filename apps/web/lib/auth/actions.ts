"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginWithPassword, signupWithPassword } from "./service";
import { clearSessionCookie, setSessionCookie } from "./session";

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const DEFAULT_REDIRECT = "/account";

export async function loginAction(_previousState: AuthFormState | void, formData: FormData) {
  const result = await loginWithPassword({
    email: getString(formData, "email"),
    password: getString(formData, "password")
  });

  if (!result.ok) {
    return {
      error: result.message,
      fieldErrors: result.fieldErrors
    } satisfies AuthFormState;
  }

  const cookieStore = await cookies();
  await setSessionCookie(cookieStore, {
    id: result.user.id,
    email: result.user.email
  });

  redirect(getNextPath(formData));
}

export async function signupAction(_previousState: AuthFormState | void, formData: FormData) {
  const result = await signupWithPassword({
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    password: getString(formData, "password")
  });

  if (!result.ok) {
    return {
      error: result.message,
      fieldErrors: result.fieldErrors
    } satisfies AuthFormState;
  }

  const cookieStore = await cookies();
  await setSessionCookie(cookieStore, {
    id: result.user.id,
    email: result.user.email
  });

  redirect(getNextPath(formData));
}

export async function logoutAction() {
  const cookieStore = await cookies();
  clearSessionCookie(cookieStore);
  redirect("/");
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function getNextPath(formData: FormData) {
  const nextPath = getString(formData, "next");

  if (!nextPath || !nextPath.startsWith("/")) {
    return DEFAULT_REDIRECT;
  }

  return nextPath;
}
