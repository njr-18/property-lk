"use server";

import {
  updateInquiryStatus,
  updateListingModerationStatus,
  updateListingVerification
} from "@property-lk/db";
import {
  parseAdminInquiryStatusInput,
  parseAdminListingModerationInput,
  parseAdminListingVerificationInput
} from "@property-lk/validation";
import { revalidatePath } from "next/cache";
import { requireAdminSessionUser } from "../../lib/auth";

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function updateListingModerationAction(
  _previousState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  try {
    const adminUser = await requireAdminSessionUser();
    const parsed = parseAdminListingModerationInput({
      listingId: getStringValue(formData.get("listingId")),
      action: getStringValue(formData.get("action"))
    });

    if (!parsed.ok) {
      return {
        status: "error",
        message: parsed.errors[0]?.message ?? "Enter a valid listing moderation update."
      };
    }

    await updateListingModerationStatus({
      listingId: parsed.data.listingId,
      status: mapListingModerationActionToStatus(parsed.data.action),
      changedByUserId: adminUser.id,
      changeSummary: buildListingModerationSummary(parsed.data.action)
    });

    revalidateAdminListingPaths(parsed.data.listingId);

    return {
      status: "success",
      message: getListingModerationSuccessMessage(parsed.data.action)
    };
  } catch (error) {
    return toAdminActionErrorState(error, "The listing moderation update could not be saved.");
  }
}

export async function updateListingVerificationAction(
  _previousState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  try {
    const adminUser = await requireAdminSessionUser();
    const parsed = parseAdminListingVerificationInput({
      listingId: getStringValue(formData.get("listingId")),
      phoneVerified: formData.get("phoneVerified") === "on",
      ownerVerified: formData.get("ownerVerified") === "on",
      agencyVerified: formData.get("agencyVerified") === "on"
    });

    if (!parsed.ok) {
      return {
        status: "error",
        message: parsed.errors[0]?.message ?? "Enter valid verification values."
      };
    }

    await updateListingVerification({
      listingId: parsed.data.listingId,
      changedByUserId: adminUser.id,
      phoneVerified: parsed.data.phoneVerified,
      ownerVerified: parsed.data.ownerVerified,
      agencyVerified: parsed.data.agencyVerified
    });

    revalidateAdminListingPaths(parsed.data.listingId);

    return {
      status: "success",
      message: "Verification flags updated successfully."
    };
  } catch (error) {
    return toAdminActionErrorState(error, "The verification update could not be saved.");
  }
}

export async function updateInquiryStatusAction(
  _previousState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  try {
    await requireAdminSessionUser();
    const parsed = parseAdminInquiryStatusInput({
      inquiryId: getStringValue(formData.get("inquiryId")),
      status: getStringValue(formData.get("status"))
    });

    if (!parsed.ok) {
      return {
        status: "error",
        message: parsed.errors[0]?.message ?? "Enter a valid inquiry status."
      };
    }

    await updateInquiryStatus({
      inquiryId: parsed.data.inquiryId,
      status: parsed.data.status
    });

    revalidateAdminInquiryPaths(parsed.data.inquiryId);

    return {
      status: "success",
      message: "Inquiry status updated successfully."
    };
  } catch (error) {
    return toAdminActionErrorState(error, "The inquiry status update could not be saved.");
  }
}

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : undefined;
}

function buildListingModerationSummary(action: "approve" | "reject" | "expire" | "archive") {
  switch (action) {
    case "approve":
      return "Approved listing for publication";
    case "reject":
      return "Rejected listing during moderation";
    case "expire":
      return "Expired listing from admin moderation";
    case "archive":
      return "Archived listing from admin moderation";
  }
}

function getListingModerationSuccessMessage(
  action: "approve" | "reject" | "expire" | "archive"
) {
  switch (action) {
    case "approve":
      return "Listing approved successfully.";
    case "reject":
      return "Listing rejected successfully.";
    case "expire":
      return "Listing expired successfully.";
    case "archive":
      return "Listing archived successfully.";
  }
}

function mapListingModerationActionToStatus(action: "approve" | "reject" | "expire" | "archive") {
  switch (action) {
    case "approve":
      return "ACTIVE" as const;
    case "reject":
      return "REJECTED" as const;
    case "expire":
      return "EXPIRED" as const;
    case "archive":
      return "ARCHIVED" as const;
  }
}

function revalidateAdminListingPaths(listingId: string) {
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/listings/${listingId}`);
}

function revalidateAdminInquiryPaths(inquiryId: string) {
  revalidatePath("/");
  revalidatePath("/inquiries");
  revalidatePath(`/inquiries/${inquiryId}`);
}

function toAdminActionErrorState(error: unknown, fallbackMessage: string): AdminActionState {
  if (error instanceof Error) {
    if (error.message === "ADMIN_AUTH_REQUIRED") {
      return {
        status: "error",
        message: "Admin authorization is required for this action."
      };
    }

    if (error.message === "LISTING_NOT_FOUND") {
      return {
        status: "error",
        message: "The listing could not be found."
      };
    }

    if (error.message === "INQUIRY_NOT_FOUND") {
      return {
        status: "error",
        message: "The inquiry could not be found."
      };
    }
  }

  return {
    status: "error",
    message: fallbackMessage
  };
}
