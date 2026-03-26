import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    route: "moderation",
    status: "ok",
    queue: {
      listings: 18,
      reports: 24,
      duplicates: 7
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  return NextResponse.json({
    route: "moderation",
    accepted: true,
    action: body
  });
}
