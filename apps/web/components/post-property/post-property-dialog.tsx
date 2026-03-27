"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Dialog } from "@property-lk/ui";

export function PostPropertyDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Submission flow preview</CardTitle>
          <CardDescription>
            A lightweight handoff for the listing wizard, verification checks, and moderation queue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="muted">
            The MVP shell is ready for a guided form without committing to uploads, pricing rules, or moderation logic yet.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsOpen(true)} variant="secondary">
            View checklist
          </Button>
        </CardFooter>
      </Card>

      <Dialog
        description="This is a presentational preview only. It does not submit data."
        footer={
          <Button onClick={() => setIsOpen(false)} variant="primary">
            Close preview
          </Button>
        }
        onClose={() => setIsOpen(false)}
        open={isOpen}
        title="Post property MVP flow"
      >
        <div className="table">
          <div className="table-row">
            <strong>Step 1</strong>
            <span>Property basics, listing type, and area selection.</span>
          </div>
          <div className="table-row">
            <strong>Step 2</strong>
            <span>Photos, amenities, and description quality checks.</span>
          </div>
          <div className="table-row">
            <strong>Step 3</strong>
            <span>Review state, moderation note, and publish confirmation.</span>
          </div>
        </div>
      </Dialog>
    </>
  );
}
