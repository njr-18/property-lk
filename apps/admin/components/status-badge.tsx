import { Badge } from "@property-lk/ui";
import { formatStatusLabel } from "../lib/format";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const variant =
    normalizedStatus === "approved" || normalizedStatus === "active" || normalizedStatus === "verified"
      ? "success"
      : normalizedStatus === "pending" || normalizedStatus === "new" || normalizedStatus === "contacted"
        ? "warning"
        : normalizedStatus === "rejected" || normalizedStatus === "spam" || normalizedStatus === "closed"
          ? "neutral"
          : "accent";

  return <Badge variant={variant}>{formatStatusLabel(status)}</Badge>;
}
