import { NextResponse } from "next/server";
import { sampleListings } from "../../../lib/site-data";

export function GET() {
  return NextResponse.json({
    ok: true,
    results: sampleListings
  });
}
