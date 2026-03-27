"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button, Checkbox, Select } from "@property-lk/ui";
import {
  updateInquiryStatusAction,
  updateListingModerationAction,
  updateListingVerificationAction
} from "../app/actions/moderation";
import type { AdminActionState } from "../app/actions/moderation";

type ListingModerationFormProps = {
  listingId: string;
};

type ListingVerificationFormProps = {
  listingId: string;
  phoneVerified: boolean;
  ownerVerified: boolean;
  agencyVerified: boolean;
};

type InquiryStatusFormProps = {
  inquiryId: string;
  status: "NEW" | "CONTACTED" | "CLOSED" | "SPAM";
};

const initialAdminActionState: AdminActionState = {
  status: "idle"
};

export function ListingModerationForm({ listingId }: ListingModerationFormProps) {
  const [state, formAction] = useActionState(
    updateListingModerationAction,
    initialAdminActionState
  );

  return (
    <form action={formAction} className="stack compact">
      <input name="listingId" type="hidden" value={listingId} />
      <Select
        defaultValue="approve"
        label="Listing status action"
        name="action"
        options={[
          { label: "Approve listing", value: "approve" },
          { label: "Reject listing", value: "reject" },
          { label: "Expire listing", value: "expire" },
          { label: "Archive listing", value: "archive" }
        ]}
      />
      <ActionFeedback state={state} />
      <SubmitButton label="Apply moderation update" />
    </form>
  );
}

export function ListingVerificationForm({
  listingId,
  phoneVerified,
  ownerVerified,
  agencyVerified
}: ListingVerificationFormProps) {
  const [state, formAction] = useActionState(
    updateListingVerificationAction,
    initialAdminActionState
  );

  return (
    <form action={formAction} className="stack compact">
      <input name="listingId" type="hidden" value={listingId} />
      <Checkbox
        defaultChecked={phoneVerified}
        description="Marks the primary contact phone as verified."
        label="Phone verified"
        name="phoneVerified"
      />
      <Checkbox
        defaultChecked={ownerVerified}
        description="Confirms owner identity or ownership proof has been reviewed."
        label="Owner verified"
        name="ownerVerified"
      />
      <Checkbox
        defaultChecked={agencyVerified}
        description="Confirms agency credentials have been reviewed."
        label="Agency verified"
        name="agencyVerified"
      />
      <ActionFeedback state={state} />
      <SubmitButton label="Save verification flags" />
    </form>
  );
}

export function InquiryStatusForm({ inquiryId, status }: InquiryStatusFormProps) {
  const [state, formAction] = useActionState(updateInquiryStatusAction, initialAdminActionState);

  return (
    <form action={formAction} className="stack compact">
      <input name="inquiryId" type="hidden" value={inquiryId} />
      <Select
        defaultValue={status}
        label="Inquiry status"
        name="status"
        options={[
          { label: "New", value: "NEW" },
          { label: "Contacted", value: "CONTACTED" },
          { label: "Closed", value: "CLOSED" },
          { label: "Spam", value: "SPAM" }
        ]}
      />
      <ActionFeedback state={state} />
      <SubmitButton label="Save inquiry status" />
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
