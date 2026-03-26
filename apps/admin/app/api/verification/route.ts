import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    route: "verification",
    checks: [
      { listing: "LKT-1024", status: "review_required" },
      { listing: "LKT-1031", status: "verified" }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  return NextResponse.json({
    route: "verification",
    accepted: true,
    action: body
  });
}
