export const inquiryContactMethods = ["call", "whatsapp", "email"] as const;

export type InquiryContactMethod = (typeof inquiryContactMethods)[number];

export type InquiryPayload = {
  listingId: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  preferredContactMethod?: InquiryContactMethod;
};
