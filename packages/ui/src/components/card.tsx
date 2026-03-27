import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "./utils";

type CardBaseProps = HTMLAttributes<HTMLElement>;

export function Card({ className, ...props }: CardBaseProps) {
  return <article className={cn("ui-card", className)} {...props} />;
}

export function CardHeader({ className, ...props }: CardBaseProps) {
  return <header className={cn("ui-card__header", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardBaseProps) {
  return <h3 className={cn("ui-card__title", className)} {...props} />;
}

export function CardDescription({ className, ...props }: CardBaseProps) {
  return <p className={cn("ui-card__description", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardBaseProps) {
  return <div className={cn("ui-card__content", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardBaseProps) {
  return <footer className={cn("ui-card__footer", className)} {...props} />;
}

export function CardGrid({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("ui-card-grid", className)}>{children}</div>;
}
