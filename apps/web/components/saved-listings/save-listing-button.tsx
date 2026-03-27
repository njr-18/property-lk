"use client";

import { startTransition, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, type ButtonProps } from "@property-lk/ui";

type SaveListingButtonProps = {
  listingId: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
};

export function SaveListingButton({
  listingId,
  initialSaved,
  isAuthenticated,
  size = "md",
  variant = "ghost"
}: SaveListingButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
  const feedbackId = `save-listing-feedback-${listingId}`;

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch("/api/saved-listings", {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ listingId })
      });
      const payload = (await response.json().catch(() => ({ ok: false }))) as {
        ok?: boolean;
        error?: string;
        saved?: boolean;
      };

      if (!response.ok || !payload.ok || typeof payload.saved !== "boolean") {
        setError(payload.error ?? "This listing could not be updated right now.");
        return;
      }

      setIsSaved(payload.saved);
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("This listing could not be updated right now.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="stack-xs">
      <Button
        aria-describedby={error ? feedbackId : undefined}
        aria-label={isSaved ? "Remove listing from saved listings" : "Save listing"}
        aria-pressed={isSaved}
        disabled={isPending}
        onClick={() => void handleClick()}
        size={size}
        variant={variant}
      >
        {isPending ? "Working..." : isSaved ? "Saved" : "Save"}
      </Button>
      {error ? (
        <p className="ui-field__message ui-field__message--error" id={feedbackId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
