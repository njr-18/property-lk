"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@property-lk/ui";
import { PageShell } from "../../components/layout/page-shell";

export default function SearchError({
  reset
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  return (
    <PageShell>
      <Card className="panel">
        <CardHeader>
          <CardTitle>We could not load search results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="muted">
            Please try again. If the problem continues, the listing read service may not be available yet.
          </p>
          <Button onClick={() => reset()} type="button">
            Retry
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
