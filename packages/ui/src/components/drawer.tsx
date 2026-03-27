import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type DrawerSide = "left" | "right" | "bottom";

export type DrawerProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  open: boolean;
  side?: DrawerSide;
  onClose?: () => void;
  footer?: ReactNode;
};

export function Drawer({
  className,
  title,
  description,
  open,
  side = "right",
  onClose,
  footer,
  children,
  ...props
}: DrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="ui-overlay" role="presentation">
      <aside className={cn("ui-drawer", `ui-drawer--${side}`, className)} {...props}>
        <div className="ui-dialog__header">
          <div>
            <h2 className="ui-dialog__title">{title}</h2>
            {description ? <p className="ui-dialog__description">{description}</p> : null}
          </div>
          {onClose ? (
            <Button aria-label="Close navigation" onClick={onClose} size="sm" variant="ghost">
              Close
            </Button>
          ) : null}
        </div>
        <div className="ui-dialog__body">{children}</div>
        {footer ? <div className="ui-dialog__footer">{footer}</div> : null}
      </aside>
    </div>
  );
}
