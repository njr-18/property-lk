import { saveListingForUser, unsaveListingForUser } from "@property-lk/db";
import { NextResponse } from "next/server";

type SaveListingRequestContext = {
  userId: string | null;
  request: Request;
};

export async function handleSaveListingRequest({
  userId,
  request
}: SaveListingRequestContext) {
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Authentication is required to save a listing." },
      { status: 401 }
    );
  }

  const listingId = await parseListingId(request);

  if (!listingId) {
    return NextResponse.json(
      { ok: false, error: "listingId is required." },
      { status: 400 }
    );
  }

  try {
    const result = await saveListingForUser(userId, listingId);

    return NextResponse.json({
      ok: true,
      listingId: result.listingId,
      saved: result.saved
    });
  } catch (error) {
    if (error instanceof Error && error.message === "LISTING_NOT_FOUND") {
      return NextResponse.json(
        { ok: false, error: "Listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Listing could not be saved." },
      { status: 500 }
    );
  }
}

export async function handleUnsaveListingRequest({
  userId,
  request
}: SaveListingRequestContext) {
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Authentication is required to unsave a listing." },
      { status: 401 }
    );
  }

  const listingId = await parseListingId(request);

  if (!listingId) {
    return NextResponse.json(
      { ok: false, error: "listingId is required." },
      { status: 400 }
    );
  }

  try {
    const result = await unsaveListingForUser(userId, listingId);

    return NextResponse.json({
      ok: true,
      listingId: result.listingId,
      saved: result.saved
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Listing could not be unsaved." },
      { status: 500 }
    );
  }
}

async function parseListingId(request: Request) {
  const body = await request.json().catch(() => ({}));
  return typeof body.listingId === "string" ? body.listingId : null;
}
