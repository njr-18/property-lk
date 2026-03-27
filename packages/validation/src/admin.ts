import {
  adminInquiryStatuses,
  adminListingModerationActions,
  type AdminInquiryStatus,
  type AdminListingModerationAction
} from "@property-lk/types";

type ValidationResult<TField extends string, TData> =
  | {
      ok: true;
      data: TData;
      errors: Array<{
        field: TField;
        message: string;
      }>;
    }
  | {
      ok: false;
      errors: Array<{
        field: TField;
        message: string;
      }>;
    };

type ListingModerationField = "listingId" | "action";
type ListingVerificationField = "listingId";
type InquiryStatusField = "inquiryId" | "status";

export function parseAdminListingModerationInput(input: {
  listingId?: string;
  action?: string;
}): ValidationResult<
  ListingModerationField,
  {
    listingId: string;
    action: AdminListingModerationAction;
  }
> {
  const errors: Array<{ field: ListingModerationField; message: string }> = [];
  const listingId = normalizeInput(input.listingId);
  const action = normalizeInput(input.action);

  if (!listingId) {
    errors.push({
      field: "listingId",
      message: "Listing id is required."
    });
  }

  if (!action || !adminListingModerationActions.includes(action as AdminListingModerationAction)) {
    errors.push({
      field: "action",
      message: "Choose a valid moderation action."
    });
  }

  if (errors.length > 0 || !listingId || !action) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    data: {
      listingId,
      action: action as AdminListingModerationAction
    },
    errors
  };
}

export function parseAdminListingVerificationInput(input: {
  listingId?: string;
  phoneVerified?: boolean;
  ownerVerified?: boolean;
  agencyVerified?: boolean;
}): ValidationResult<
  ListingVerificationField,
  {
    listingId: string;
    phoneVerified: boolean;
    ownerVerified: boolean;
    agencyVerified: boolean;
  }
> {
  const errors: Array<{ field: ListingVerificationField; message: string }> = [];
  const listingId = normalizeInput(input.listingId);

  if (!listingId) {
    errors.push({
      field: "listingId",
      message: "Listing id is required."
    });
  }

  if (errors.length > 0 || !listingId) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    data: {
      listingId,
      phoneVerified: Boolean(input.phoneVerified),
      ownerVerified: Boolean(input.ownerVerified),
      agencyVerified: Boolean(input.agencyVerified)
    },
    errors
  };
}

export function parseAdminInquiryStatusInput(input: {
  inquiryId?: string;
  status?: string;
}): ValidationResult<
  InquiryStatusField,
  {
    inquiryId: string;
    status: AdminInquiryStatus;
  }
> {
  const errors: Array<{ field: InquiryStatusField; message: string }> = [];
  const inquiryId = normalizeInput(input.inquiryId);
  const status = normalizeInput(input.status);

  if (!inquiryId) {
    errors.push({
      field: "inquiryId",
      message: "Inquiry id is required."
    });
  }

  if (!status || !adminInquiryStatuses.includes(status as AdminInquiryStatus)) {
    errors.push({
      field: "status",
      message: "Choose a valid inquiry status."
    });
  }

  if (errors.length > 0 || !inquiryId || !status) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    data: {
      inquiryId,
      status: status as AdminInquiryStatus
    },
    errors
  };
}

function normalizeInput(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}
