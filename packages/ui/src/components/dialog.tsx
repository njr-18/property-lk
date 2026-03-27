import { useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "./button";
import { cn } from "./utils";

export type DialogProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  open: boolean;
  onClose?: () => void;
  footer?: ReactNode;
};

export function Dialog({
  className,
  title,
  description,
  open,
  onClose,
  footer,
  children,
  ...props
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  if (!open) {
    return null;
  }

  return (
    <div className="ui-overlay" role="presentation">
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn("ui-dialog", className)}
        role="dialog"
        {...props}
      >
        <div className="ui-dialog__header">
          <div>
            <h2 className="ui-dialog__title" id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className="ui-dialog__description" id={descriptionId}>
                {description}
              </p>
            ) : null}
          </div>
          {onClose ? (
            <Button aria-label="Close dialog" onClick={onClose} size="sm" variant="ghost">
              Close
            </Button>
          ) : null}
        </div>
        <div className="ui-dialog__body">{children}</div>
        {footer ? <div className="ui-dialog__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
