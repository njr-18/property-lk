import { createInquiry } from "@property-lk/db";
import { parseInquiryInput } from "@property-lk/validation";
import { NextResponse } from "next/server";
import { consumeRateLimit, getRateLimitKey } from "../../../lib/rate-limit";

type InquiryRequestContext = {
  request: Request;
  userId: string | null;
};

export async function handleCreateInquiry({
  request,
  userId
}: InquiryRequestContext) {
  const limit = consumeRateLimit(getRateLimitKey(request, "inquiry"), {
    limit: 5,
    windowMs: 60_000
  });

  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many inquiry attempts. Please wait a moment and try again.",
        retryAfterSeconds: limit.retryAfterSeconds
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSeconds)
        }
      }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = parseInquiryInput(body);

  if (!parsed.ok || !parsed.data) {
    return NextResponse.json(
      {
        ok: false,
        error: "Inquiry is invalid.",
        fieldErrors: parsed.errors
      },
      { status: 400 }
    );
  }

  try {
    const inquiry = await createInquiry({
      ...parsed.data,
      userId: userId ?? undefined,
      source: "WEB_MVP"
    });

    return NextResponse.json({
      ok: true,
      inquiry: {
        id: inquiry.id,
        createdAt: inquiry.createdAt
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "LISTING_NOT_FOUND") {
      return NextResponse.json(
        { ok: false, error: "Listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Inquiry could not be submitted." },
      { status: 500 }
    );
  }
}
