import Link from "next/link";
import { EmptyState as SharedEmptyState, buttonClassName } from "@property-lk/ui";

export function EmptyState({
  title,
  description,
  href,
  actionLabel = "Back to home"
}: Readonly<{
  title: string;
  description: string;
  href: string;
  actionLabel?: string;
}>) {
  return (
    <SharedEmptyState
      action={
        <Link className={buttonClassName({ variant: "primary", size: "md" })} href={href}>
          {actionLabel}
        </Link>
      }
      description={description}
      title={title}
    />
  );
}
