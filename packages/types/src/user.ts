export type UserSummary = {
  id: string;
  name?: string;
  email: string;
  role: "USER" | "AGENT" | "OWNER" | "ADMIN";
};
