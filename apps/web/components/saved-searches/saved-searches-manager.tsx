"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Checkbox, Input } from "@property-lk/ui";
import type { NormalizedListingSearchFilters } from "@property-lk/types";
import { buildSavedSearchHref } from "../../lib/saved-searches";

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
};

export function SavedSearchesManager({ initialSavedSearches }: SavedSearchesManagerProps) {
  const [savedSearches, setSavedSearches] = useState(initialSavedSearches);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, string>>({});

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
    setStatus((current) => ({ ...current, [id]: "" }));

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
        [id]: payload.error ?? "Saved search could not be updated."
      }));
      setPendingId(null);
      return;
    }

    setSavedSearches((current) =>
      current.map((savedSearch) => (savedSearch.id === id ? payload.savedSearch! : savedSearch))
    );
    setStatus((current) => ({ ...current, [id]: "Saved changes." }));
    setPendingId(null);
  }

  async function deleteSearch(id: string) {
    setPendingId(id);
    setStatus((current) => ({ ...current, [id]: "" }));

    const response = await fetch(`/api/saved-searches/${id}`, {
      method: "DELETE"
    });

    const payload = (await response.json().catch(() => ({ ok: false }))) as SavedSearchResponse;

    if (!response.ok || !payload.ok) {
      setStatus((current) => ({
        ...current,
        [id]: payload.error ?? "Saved search could not be deleted."
      }));
      setPendingId(null);
      return;
    }

    setSavedSearches((current) => current.filter((savedSearch) => savedSearch.id !== id));
    setPendingId(null);
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
  status?: string;
  formatter: Intl.DateTimeFormat;
  onUpdate: (id: string, input: { name?: string; alertEnabled?: boolean }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [name, setName] = useState(savedSearch.name);
  const [alertEnabled, setAlertEnabled] = useState(savedSearch.alertEnabled);
  const href = buildSavedSearchHref(savedSearch.searchParams);
  const hasChanges = name.trim() !== savedSearch.name || alertEnabled !== savedSearch.alertEnabled;

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
          label="Name"
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
        <Checkbox
          checked={alertEnabled}
          description="Alerts are stored now and ready for later delivery work."
          label="Enable alerts"
          onChange={(event) => setAlertEnabled(event.target.checked)}
        />
        <p className="muted">
          Frequency: {savedSearch.alertFrequency}. Created{" "}
          {formatter.format(new Date(savedSearch.createdAt))}.
        </p>
        {status ? <p className="ui-field__message">{status}</p> : null}
      </CardContent>
      <CardFooter>
        <Button
          disabled={pending || !hasChanges}
          onClick={() => void onUpdate(savedSearch.id, { name: name.trim(), alertEnabled })}
        >
          {pending ? "Saving..." : "Save changes"}
        </Button>
        <Link className="ui-button ui-button--secondary ui-button--md" href={href}>
          View search
        </Link>
        <Button
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
