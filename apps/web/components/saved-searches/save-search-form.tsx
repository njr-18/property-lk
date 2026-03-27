"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input } from "@property-lk/ui";

type SaveSearchFormProps = {
  isAuthenticated: boolean;
  defaultName: string;
};

type SaveSearchResponse = {
  ok: boolean;
  error?: string;
  fieldErrors?: Array<{ field: string; message: string }>;
};

export function SaveSearchForm({ isAuthenticated, defaultName }: SaveSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState(defaultName);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);

  const nextPath = searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname;

  async function handleSave() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    setIsPending(true);
    setError(null);
    setNameError(null);

    const response = await fetch("/api/saved-searches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        alertEnabled,
        searchParams: Object.fromEntries(searchParams.entries())
      })
    });

    const payload = (await response.json().catch(() => ({ ok: false }))) as SaveSearchResponse;

    if (!response.ok || !payload.ok) {
      setError(payload.error ?? "Saved search could not be created.");
      setNameError(
        payload.fieldErrors?.find((fieldError) => fieldError.field === "name")?.message ?? null
      );
      setIsPending(false);
      return;
    }

    setSavedName(name.trim());
    setIsOpen(false);
    startTransition(() => {
      router.refresh();
    });
    setIsPending(false);
  }

  if (savedName) {
    return (
      <Card className="panel">
        <CardHeader>
          <CardTitle>Search saved</CardTitle>
        </CardHeader>
        <CardContent className="stack-sm">
          <p className="muted">
            <strong>{savedName}</strong> is ready in your saved searches.
          </p>
          <div className="button-row">
            <Link className="ui-button ui-button--primary ui-button--md" href="/saved/searches">
              View saved searches
            </Link>
            <Button onClick={() => setSavedName(null)} variant="secondary">
              Save another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle>Save this search</CardTitle>
      </CardHeader>
      <CardContent className="stack-sm">
        <p className="muted">
          Keep these filters with a custom name and choose whether alerts should be enabled.
        </p>
        {isOpen ? (
          <div className="stack-sm">
            <Input
              error={nameError ?? undefined}
              label="Saved search name"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
            <Checkbox
              checked={alertEnabled}
              description="This is wired for the MVP now, with future alert delivery to follow."
              label="Enable alerts"
              onChange={(event) => setAlertEnabled(event.target.checked)}
            />
            {error ? <p className="ui-field__message ui-field__message--error">{error}</p> : null}
            <div className="button-row">
              <Button disabled={isPending} onClick={() => void handleSave()}>
                {isPending ? "Saving..." : "Save search"}
              </Button>
              <Button onClick={() => setIsOpen(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="button-row">
            <Button onClick={() => setIsOpen(true)}>Save current filters</Button>
            <Link className="ui-button ui-button--secondary ui-button--md" href="/saved/searches">
              Manage saved searches
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
