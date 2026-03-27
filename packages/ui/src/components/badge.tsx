import type { HTMLAttributes } from "react";
import { cn } from "./utils";

type BadgeVariant = "accent" | "neutral" | "success" | "warning";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "accent", ...props }: BadgeProps) {
  return <span className={cn("ui-badge", `ui-badge--${variant}`, className)} {...props} />;
}
