"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button, Select } from "@property-lk/ui";
import { updateDuplicateClusterStatusAction, type AdminActionState } from "../app/actions/moderation";

type DuplicateClusterReviewFormProps = {
  clusterId: string;
  currentStatus: "PENDING" | "CONFIRMED_DUPLICATE" | "NOT_DUPLICATE" | "MERGE_CANDIDATE";
};

const initialAdminActionState: AdminActionState = {
  status: "idle"
};

export function DuplicateClusterReviewForm({
  clusterId,
  currentStatus
}: DuplicateClusterReviewFormProps) {
  const [state, formAction] = useActionState(
    updateDuplicateClusterStatusAction,
    initialAdminActionState
  );

  return (
    <form action={formAction} className="stack compact">
      <input name="clusterId" type="hidden" value={clusterId} />
      <Select
        defaultValue={currentStatus}
        label="Cluster review outcome"
        name="status"
        options={[
          { label: "Pending review", value: "PENDING" },
          { label: "Confirmed duplicate", value: "CONFIRMED_DUPLICATE" },
          { label: "Not duplicate", value: "NOT_DUPLICATE" },
          { label: "Merge candidate", value: "MERGE_CANDIDATE" }
        ]}
      />
      <ActionFeedback state={state} />
      <SubmitButton label="Save review outcome" />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? "Saving..." : label}
    </Button>
  );
}

function ActionFeedback({ state }: { state: AdminActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <p
      aria-live="polite"
      className={state.status === "success" ? "form-feedback success" : "form-feedback error"}
    >
      {state.message}
    </p>
  );
}
