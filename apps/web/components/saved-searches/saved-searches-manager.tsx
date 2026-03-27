"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Checkbox, Input } from "@property-lk/ui";
import type { NormalizedListingSearchFilters } from "@property-lk/types";
import { EmptyState } from "../ui/empty-state";
import { buildSavedSearchHref } from "../../lib/saved-search-links";

type SavedSearchItem = {
  id: string;
  name: string;
  alertEnabled: boolean;
  alertFrequency: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  searchParams: NormalizedListingSearchFilters;
};

type SavedSearchesManagerProps = {
  initialSavedSearches: SavedSearchItem[];
};

type SavedSearchResponse = {
  ok: boolean;
  error?: string;
  savedSearch?: SavedSearchItem;
  savedSearchId?: string;
  fieldErrors?: Array<{ field: string; message: string }>;
};

type SavedSearchStatus = {
  kind: "success" | "error";
  message: string;
  nameError?: string;
};

export function SavedSearchesManager({ initialSavedSearches }: SavedSearchesManagerProps) {
  const [savedSearches, setSavedSearches] = useState(initialSavedSearches);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, SavedSearchStatus | undefined>>({});

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-LK", {
        dateStyle: "medium",
        timeStyle: "short"
      }),
    []
  );

  async function updateSearch(id: string, input: { name?: string; alertEnabled?: boolean }) {
    setPendingId(id);
    setStatus((current) => ({ ...current, [id]: undefined }));

    try {
      const response = await fetch(`/api/saved-searches/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const payload = (await response.json().catch(() => ({ ok: false }))) as SavedSearchResponse;

      if (!response.ok || !payload.ok || !payload.savedSearch) {
        setStatus((current) => ({
          ...current,
          [id]: {
            kind: "error",
            message: payload.error ?? "Saved search could not be updated.",
            nameError:
              payload.fieldErrors?.find((fieldError) => fieldError.field === "name")?.message ??
              undefined
          }
        }));
        return;
      }

      setSavedSearches((current) =>
        current.map((savedSearch) => (savedSearch.id === id ? payload.savedSearch! : savedSearch))
      );
      setStatus((current) => ({
        ...current,
        [id]: {
          kind: "success",
          message: "Saved changes."
        }
      }));
    } catch {
      setStatus((current) => ({
        ...current,
        [id]: {
          kind: "error",
          message: "Saved search could not be updated."
        }
      }));
    } finally {
      setPendingId(null);
    }
  }

  async function deleteSearch(id: string) {
    setPendingId(id);
    setStatus((current) => ({ ...current, [id]: undefined }));

    try {
      const response = await fetch(`/api/saved-searches/${id}`, {
        method: "DELETE"
      });

      const payload = (await response.json().catch(() => ({ ok: false }))) as SavedSearchResponse;

      if (!response.ok || !payload.ok) {
        setStatus((current) => ({
          ...current,
          [id]: {
            kind: "error",
            message: payload.error ?? "Saved search could not be deleted."
          }
        }));
        return;
      }

      setSavedSearches((current) => current.filter((savedSearch) => savedSearch.id !== id));
    } catch {
      setStatus((current) => ({
        ...current,
        [id]: {
          kind: "error",
          message: "Saved search could not be deleted."
        }
      }));
    } finally {
      setPendingId(null);
    }
  }

  if (savedSearches.length === 0) {
    return (
      <EmptyState
        actionLabel="Start searching"
        description="Save a search from the search page and it will appear here for quick reuse."
        href="/search"
        title="No saved searches yet"
      />
    );
  }

  return (
    <div className="stack-lg">
      {savedSearches.map((savedSearch) => (
        <SavedSearchCard
          formatter={formatter}
          key={savedSearch.id}
          onDelete={deleteSearch}
          onUpdate={updateSearch}
          pending={pendingId === savedSearch.id}
          savedSearch={savedSearch}
          status={status[savedSearch.id]}
        />
      ))}
    </div>
  );
}

function SavedSearchCard({
  savedSearch,
  pending,
  status,
  formatter,
  onUpdate,
  onDelete
}: {
  savedSearch: SavedSearchItem;
  pending: boolean;
  status?: SavedSearchStatus;
  formatter: Intl.DateTimeFormat;
  onUpdate: (id: string, input: { name?: string; alertEnabled?: boolean }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [name, setName] = useState(savedSearch.name);
  const [alertEnabled, setAlertEnabled] = useState(savedSearch.alertEnabled);
  const href = buildSavedSearchHref(savedSearch.searchParams);
  const hasChanges = name.trim() !== savedSearch.name || alertEnabled !== savedSearch.alertEnabled;
  const statusId = `saved-search-status-${savedSearch.id}`;

  return (
    <Card className="panel">
      <CardHeader>
        <div className="table-row table-row--compact">
          <div className="stack-xs">
            <CardTitle>{savedSearch.name}</CardTitle>
            <p className="muted">
              Updated {formatter.format(new Date(savedSearch.updatedAt))}
            </p>
          </div>
          <Badge variant={alertEnabled ? "success" : "neutral"}>
            {alertEnabled ? "Alerts on" : "Alerts off"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="stack-sm">
        <Input
          error={status?.kind === "error" ? status.nameError : undefined}
          id={`saved-search-name-${savedSearch.id}`}
          label="Name"
          name={`savedSearchName-${savedSearch.id}`}
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
        <Checkbox
          checked={alertEnabled}
          description="Alerts are stored now and ready for later delivery work."
          id={`saved-search-alerts-${savedSearch.id}`}
          label="Enable alerts"
          onChange={(event) => setAlertEnabled(event.target.checked)}
        />
        <p className="muted">
          Frequency: {savedSearch.alertFrequency}. Created{" "}
          {formatter.format(new Date(savedSearch.createdAt))}.
        </p>
        {status ? (
          <p
            className={
              status.kind === "error"
                ? "ui-field__message ui-field__message--error"
                : "ui-field__message"
            }
            id={statusId}
            role={status.kind === "error" ? "alert" : "status"}
          >
            {status.message}
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button
          aria-describedby={status ? statusId : undefined}
          disabled={pending || !hasChanges}
          onClick={() => void onUpdate(savedSearch.id, { name: name.trim(), alertEnabled })}
        >
          {pending ? "Saving..." : "Save changes"}
        </Button>
        <Link className="ui-button ui-button--secondary ui-button--md" href={href}>
          View search
        </Link>
        <Button
          aria-describedby={status ? statusId : undefined}
          disabled={pending}
          onClick={() => void onDelete(savedSearch.id)}
          variant="ghost"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
