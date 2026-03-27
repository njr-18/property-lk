import type { ButtonHTMLAttributes } from "react";
import { cn } from "./utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function buttonClassName({
  className,
  variant = "primary",
  size = "md",
  fullWidth = false
}: Pick<ButtonProps, "className" | "variant" | "size" | "fullWidth">) {
  return cn(
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    fullWidth && "ui-button--full-width",
    className
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClassName({ className, variant, size, fullWidth })}
      data-variant={variant}
      data-size={size}
      type={type}
      {...props}
    />
  );
}
