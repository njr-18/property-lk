import type { InputHTMLAttributes } from "react";
import { cn } from "./utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ className, label, hint, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="ui-field" htmlFor={inputId}>
      {label ? <span className="ui-field__label">{label}</span> : null}
      <input
        className={cn("ui-input", error && "ui-input--error", className)}
        id={inputId}
        {...props}
      />
      {error ? <span className="ui-field__message ui-field__message--error">{error}</span> : null}
      {!error && hint ? <span className="ui-field__message">{hint}</span> : null}
    </label>
  );
}
