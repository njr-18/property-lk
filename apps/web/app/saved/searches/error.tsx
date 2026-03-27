"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@property-lk/ui";
import { PageShell } from "../../../components/layout/page-shell";

export default function SavedSearchesError({
  reset
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  return (
    <PageShell>
      <Card className="panel">
        <CardHeader>
          <CardTitle>We could not load saved searches</CardTitle>
        </CardHeader>
        <CardContent className="stack-sm">
          <p className="muted">
            Please try again. If the problem continues, your saved searches may be temporarily unavailable.
          </p>
          <Button onClick={() => reset()} type="button">
            Retry
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
