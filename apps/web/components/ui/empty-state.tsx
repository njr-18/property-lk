import Link from "next/link";

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
    <div className="panel">
      <h2>{title}</h2>
      <p className="muted">{description}</p>
      <div className="button-row">
        <Link className="button primary" href={href}>
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}
