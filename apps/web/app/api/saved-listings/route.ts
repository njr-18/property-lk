import { NextResponse } from "next/server";
import { getSessionUser } from "../../../lib/auth";
import { handleSaveListingRequest, handleUnsaveListingRequest } from "./handlers";

export async function GET() {
  const user = await getSessionUser();

  return NextResponse.json({
    ok: true,
    authenticated: Boolean(user)
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  return handleSaveListingRequest({
    userId: user?.id ?? null,
    request
  });
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();

  return handleUnsaveListingRequest({
    userId: user?.id ?? null,
    request
  });
}
