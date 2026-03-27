"use client";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@property-lk/ui";
import { PageShell } from "../../../components/layout/page-shell";

export default function ListingDetailsError({
  reset
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  return (
    <PageShell>
      <Card className="panel">
        <CardHeader>
          <CardTitle>We could not load this listing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="muted">
            Please try again. If the problem continues, this listing may be unavailable right now.
          </p>
          <Button onClick={() => reset()} type="button">
            Retry
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
