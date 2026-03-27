import { NextResponse } from "next/server";
import { listAdminDuplicateClusters, updateDuplicateClusterStatus } from "@property-lk/db";
import { parseAdminDuplicateClusterStatusInput } from "@property-lk/validation";
import { requireAdminSessionUser } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    await requireAdminSessionUser();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? undefined;
    const clusters = await listAdminDuplicateClusters(
      status as "PENDING" | "CONFIRMED_DUPLICATE" | "NOT_DUPLICATE" | "MERGE_CANDIDATE" | undefined
    );

    return NextResponse.json({
      clusters
    });
  } catch (error) {
    return toErrorResponse(error, "The duplicate clusters could not be loaded.");
  }
}

export async function POST(request: Request) {
  try {
    const adminUser = await requireAdminSessionUser();
    const body = await request.json().catch(() => null);
    const parsed = parseAdminDuplicateClusterStatusInput({
      clusterId: typeof body?.clusterId === "string" ? body.clusterId : undefined,
      status: typeof body?.status === "string" ? body.status : undefined
    });

    if (!parsed.ok) {
      return NextResponse.json(
        {
          error: parsed.errors[0]?.message ?? "Enter a valid duplicate review update."
        },
        {
          status: 400
        }
      );
    }

    const cluster = await updateDuplicateClusterStatus({
      clusterId: parsed.data.clusterId,
      status: parsed.data.status,
      reviewedByUserId: adminUser.id
    });

    return NextResponse.json({
      cluster
    });
  } catch (error) {
    return toErrorResponse(error, "The duplicate cluster update could not be saved.");
  }
}

function toErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message === "ADMIN_AUTH_REQUIRED") {
    return NextResponse.json(
      {
        error: "Admin authorization is required."
      },
      {
        status: 401
      }
    );
  }

  if (error instanceof Error && error.message === "DUPLICATE_CLUSTER_NOT_FOUND") {
    return NextResponse.json(
      {
        error: "The duplicate cluster could not be found."
      },
      {
        status: 404
      }
    );
  }

  return NextResponse.json(
    {
      error: fallbackMessage
    },
    {
      status: 500
    }
  );
}
