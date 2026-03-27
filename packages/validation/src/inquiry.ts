import {
  inquiryContactMethods,
  type InquiryContactMethod,
  type InquiryPayload
} from "@property-lk/types";

export type InquiryFieldError = {
  field:
    | "listingId"
    | "name"
    | "email"
    | "phone"
    | "message"
    | "preferredContactMethod";
  message: string;
};

export type InquiryValidationResult = {
  ok: boolean;
  data?: Required<Pick<InquiryPayload, "listingId" | "name" | "email" | "message" | "preferredContactMethod">> &
    Pick<InquiryPayload, "phone">;
  errors: InquiryFieldError[];
};

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_PHONE_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 2000;

export function normalizeInquiryText(value: string | undefined) {
  const normalized = value?.trim().replace(/\s+/g, " ");
  return normalized ? normalized : undefined;
}

export function normalizeInquiryMessage(value: string | undefined) {
  const normalized = value?.trim().replace(/\r\n/g, "\n");
  return normalized ? normalized : undefined;
}

export function normalizeInquiryEmail(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  return normalized ? normalized : undefined;
}

export function normalizeInquiryPhone(value: string | undefined) {
  const normalized = value?.trim().replace(/\s+/g, " ");
  return normalized ? normalized : undefined;
}

export function validateInquiry(payload: InquiryPayload) {
  return parseInquiryInput(payload).ok;
}

export function parseInquiryInput(payload: InquiryPayload): InquiryValidationResult {
  const errors: InquiryFieldError[] = [];
  const listingId = normalizeInquiryText(payload.listingId);
  const name = normalizeInquiryText(payload.name);
  const email = normalizeInquiryEmail(payload.email);
  const phone = normalizeInquiryPhone(payload.phone);
  const message = normalizeInquiryMessage(payload.message);
  const preferredContactMethod = parsePreferredContactMethod(payload.preferredContactMethod);

  if (!listingId) {
    errors.push({
      field: "listingId",
      message: "Listing id is required."
    });
  }

  if (!name) {
    errors.push({
      field: "name",
      message: "Enter your name."
    });
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.push({
      field: "name",
      message: "Name must be 80 characters or fewer."
    });
  }

  if (!email) {
    errors.push({
      field: "email",
      message: "Enter your email address."
    });
  } else if (email.length > MAX_EMAIL_LENGTH || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({
      field: "email",
      message: "Enter a valid email address."
    });
  }

  if (phone && phone.length > MAX_PHONE_LENGTH) {
    errors.push({
      field: "phone",
      message: "Phone number must be 40 characters or fewer."
    });
  }

  if (!message) {
    errors.push({
      field: "message",
      message: "Enter a message."
    });
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.push({
      field: "message",
      message: "Message must be 2000 characters or fewer."
    });
  }

  if (!preferredContactMethod) {
    errors.push({
      field: "preferredContactMethod",
      message: "Choose how you want to be contacted."
    });
  } else if (preferredContactMethod !== "email" && !phone) {
    errors.push({
      field: "phone",
      message: "Enter a phone number for call or WhatsApp contact."
    });
  }

  if (errors.length > 0 || !listingId || !name || !email || !message || !preferredContactMethod) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    data: {
      listingId,
      name,
      email,
      phone,
      message,
      preferredContactMethod
    },
    errors
  };
}

function parsePreferredContactMethod(
  value: InquiryPayload["preferredContactMethod"]
): InquiryContactMethod | undefined {
  if (!value) {
    return undefined;
  }

  return inquiryContactMethods.includes(value) ? value : undefined;
}
