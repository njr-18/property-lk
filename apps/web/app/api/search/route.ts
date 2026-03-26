import { NextResponse } from "next/server";
import { searchListings } from "../../../lib/search";

export function GET(request: Request) {
  const url = new URL(request.url);
  const results = searchListings(url.searchParams);

  return NextResponse.json({
    ok: true,
    count: results.length,
    results
  });
}
