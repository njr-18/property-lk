import {
  createSavedSearch,
  deleteSavedSearch,
  listSavedSearches,
  updateSavedSearch
} from "@property-lk/db";
import { NextResponse } from "next/server";
import { parseSavedSearchInput } from "../../../lib/saved-searches";

type SavedSearchRequestContext = {
  userId: string | null;
  request: Request;
  savedSearchId?: string | null;
};

export async function handleListSavedSearches({ userId }: { userId: string | null }) {
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Authentication is required to view saved searches." },
      { status: 401 }
    );
  }

  const savedSearches = await listSavedSearches(userId);

  return NextResponse.json({
    ok: true,
    results: savedSearches
  });
}

export async function handleCreateSavedSearch({
  userId,
  request
}: SavedSearchRequestContext) {
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Authentication is required to save a search." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = parseSavedSearchInput(body);

  if (!parsed.ok || !parsed.data) {
    return NextResponse.json(
      { ok: false, error: "Saved search is invalid.", fieldErrors: parsed.errors },
      { status: 400 }
    );
  }

  const savedSearch = await createSavedSearch({
    userId,
    name: parsed.data.name,
    alertEnabled: parsed.data.alertEnabled,
    searchParamsJson: parsed.data.searchParams
  });

  return NextResponse.json({
    ok: true,
    savedSearch: {
      id: savedSearch.id,
      name: savedSearch.name,
      alertEnabled: savedSearch.alertEnabled,
      alertFrequency: savedSearch.alertFrequency,
      createdAt: savedSearch.createdAt,
      updatedAt: savedSearch.updatedAt,
      searchParams: savedSearch.searchParamsJson
    }
  });
}

export async function handleUpdateSavedSearch({
  userId,
  request,
  savedSearchId
}: SavedSearchRequestContext) {
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Authentication is required to update a saved search." },
      { status: 401 }
    );
  }

  if (!savedSearchId) {
    return NextResponse.json(
      { ok: false, error: "Saved search id is required." },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const nextName =
    typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : undefined;
  const nextAlertEnabled =
    typeof body.alertEnabled === "boolean" ? body.alertEnabled : undefined;

  if (nextName === undefined && nextAlertEnabled === undefined) {
    return NextResponse.json(
      { ok: false, error: "Nothing to update." },
      { status: 400 }
    );
  }

  if (nextName !== undefined && !nextName) {
    return NextResponse.json(
      {
        ok: false,
        error: "Saved search is invalid.",
        fieldErrors: [{ field: "name", message: "Enter a name for this saved search." }]
      },
      { status: 400 }
    );
  }

  if (nextName !== undefined && nextName.length > 80) {
    return NextResponse.json(
      {
        ok: false,
        error: "Saved search is invalid.",
        fieldErrors: [{ field: "name", message: "Name must be 80 characters or fewer." }]
      },
      { status: 400 }
    );
  }

  try {
    const savedSearch = await updateSavedSearch({
      userId,
      savedSearchId,
      name: nextName,
      alertEnabled: nextAlertEnabled
    });

    return NextResponse.json({
      ok: true,
      savedSearch: {
        id: savedSearch.id,
        name: savedSearch.name,
        alertEnabled: savedSearch.alertEnabled,
        alertFrequency: savedSearch.alertFrequency,
        createdAt: savedSearch.createdAt,
        updatedAt: savedSearch.updatedAt,
        searchParams: savedSearch.searchParamsJson
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "SAVED_SEARCH_NOT_FOUND") {
      return NextResponse.json(
        { ok: false, error: "Saved search not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Saved search could not be updated." },
      { status: 500 }
    );
  }
}

export async function handleDeleteSavedSearch({
  userId,
  savedSearchId
}: {
  userId: string | null;
  savedSearchId?: string | null;
}) {
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Authentication is required to delete a saved search." },
      { status: 401 }
    );
  }

  if (!savedSearchId) {
    return NextResponse.json(
      { ok: false, error: "Saved search id is required." },
      { status: 400 }
    );
  }

  try {
    await deleteSavedSearch(userId, savedSearchId);

    return NextResponse.json({
      ok: true,
      savedSearchId
    });
  } catch (error) {
    if (error instanceof Error && error.message === "SAVED_SEARCH_NOT_FOUND") {
      return NextResponse.json(
        { ok: false, error: "Saved search not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: false, error: "Saved search could not be deleted." },
      { status: 500 }
    );
  }
}
