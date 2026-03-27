"use client";

import Link from "next/link";
import { Button, EmptyState } from "@property-lk/ui";

export function RouteError({
  reset
}: Readonly<{
  reset: () => void;
}>) {
  return (
    <EmptyState
      action={
        <div className="button-row">
          <Button onClick={reset}>Try again</Button>
          <Link className="ui-button ui-button--secondary ui-button--md" href="/">
            Return home
          </Link>
        </div>
      }
      description="Something unexpected interrupted this page. The shell is safe to retry, but no state was changed."
      title="Page unavailable"
    />
  );
}
