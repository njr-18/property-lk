import { NextResponse } from "next/server";

function handler() {
  return NextResponse.json({
    ok: true,
    message: "Auth route scaffolded. Wire NextAuth here when providers are ready."
  });
}

export { handler as GET, handler as POST };
