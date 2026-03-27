import { NextResponse } from "next/server";
import { searchListings } from "../../../lib/listings";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const results = await searchListings(url.searchParams);

    return NextResponse.json({
      ok: true,
      count: results.listings.length,
      total: results.total,
      totalPages: results.totalPages,
      filters: results.filters,
      issues: results.issues,
      results: results.listings
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Search results could not be loaded" },
      { status: 500 }
    );
  }
}
