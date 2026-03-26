import { NextResponse } from "next/server";
import { getListingById } from "../../../../lib/site-data";

export function GET(_request: Request, { params }: { params: { id: string } }) {
  const listing = getListingById(params.id);

  if (!listing) {
    return NextResponse.json({ ok: false, error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, listing });
}
