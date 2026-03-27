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

  const nextPath = searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname;

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    setIsPending(true);

    const method = isSaved ? "DELETE" : "POST";
    const response = await fetch("/api/saved-listings", {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ listingId })
    });

    if (response.ok) {
      setIsSaved(!isSaved);
      startTransition(() => {
        router.refresh();
      });
    }

    setIsPending(false);
  }

  return (
    <Button disabled={isPending} onClick={() => void handleClick()} size={size} variant={variant}>
      {isPending ? "Working..." : isSaved ? "Saved" : "Save"}
    </Button>
  );
}
