import { NextResponse } from "next/server";
import { loginWithPassword } from "../../../../lib/auth";
import { setSessionCookie } from "../../../../lib/auth/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await loginWithPassword(body);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.message,
        fieldErrors: result.fieldErrors
      },
      { status: 400 }
    );
  }

  const response = NextResponse.json({
    ok: true,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role
    }
  });

  await setSessionCookie(response.cookies, {
    id: result.user.id,
    email: result.user.email
  });

  return response;
}
