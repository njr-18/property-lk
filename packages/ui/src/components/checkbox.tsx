import type { InputHTMLAttributes } from "react";
import { cn } from "./utils";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  description?: string;
};

export function Checkbox({
  className,
  label,
  description,
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id ?? props.name;

  return (
    <label className={cn("ui-checkbox", className)} htmlFor={checkboxId}>
      <input className="ui-checkbox__input" id={checkboxId} type="checkbox" {...props} />
      <span className="ui-checkbox__content">
        <span className="ui-checkbox__label">{label}</span>
        {description ? <span className="ui-checkbox__description">{description}</span> : null}
      </span>
    </label>
  );
}
