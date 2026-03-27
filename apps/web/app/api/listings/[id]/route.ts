import { NextResponse } from "next/server";
import { getListingByIdentifier } from "../../../../lib/listings";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await getListingByIdentifier(id);

    if (!listing) {
      return NextResponse.json({ ok: false, error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, listing });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Listing could not be loaded" },
      { status: 500 }
    );
  }
}
