import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    route: "duplicates",
    clusters: [
      { id: "DC-01", confidence: 0.92 },
      { id: "DC-02", confidence: 0.78 }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  return NextResponse.json({
    route: "duplicates",
    accepted: true,
    action: body
  });
}
