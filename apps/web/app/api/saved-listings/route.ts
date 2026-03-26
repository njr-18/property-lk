import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    results: [],
    message: "Saved listings API placeholder."
  });
}
