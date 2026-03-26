export type InquiryPayload = {
  listingId: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  preferredContactMethod?: "call" | "whatsapp" | "email";
};
