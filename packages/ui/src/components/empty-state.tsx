import type { ReactNode } from "react";
import { Button, buttonClassName } from "./button";
import { cn } from "./utils";

export type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  action,
  className
}: EmptyStateProps) {
  return (
    <section className={cn("ui-empty-state", className)}>
      <div className="ui-empty-state__icon" aria-hidden="true">
        PL
      </div>
      <div className="ui-empty-state__copy">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action ? (
        <div className="ui-empty-state__action">{action}</div>
      ) : actionHref && actionLabel ? (
        <div className="ui-empty-state__action">
          <a className={buttonClassName({ variant: "primary", size: "md" })} href={actionHref}>
            {actionLabel}
          </a>
        </div>
      ) : actionLabel ? (
        <div className="ui-empty-state__action">
          <Button>{actionLabel}</Button>
        </div>
      ) : null}
    </section>
  );
}
