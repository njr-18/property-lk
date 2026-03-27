import { NextResponse } from "next/server";
import { getListingById } from "../../../../lib/site-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return NextResponse.json({ ok: false, error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, listing });
}
