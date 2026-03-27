import { NextResponse } from "next/server";
import { getLatestListings } from "../../../lib/listings";

export async function GET() {
  try {
    const results = await getLatestListings();

    return NextResponse.json({
      ok: true,
      count: results.length,
      results
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Listings could not be loaded" },
      { status: 500 }
    );
  }
}
