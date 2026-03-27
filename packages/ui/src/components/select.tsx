import type { SelectHTMLAttributes } from "react";
import { cn } from "./utils";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
};

export function Select({
  className,
  label,
  hint,
  error,
  id,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="ui-field" htmlFor={selectId}>
      {label ? <span className="ui-field__label">{label}</span> : null}
      <select
        className={cn("ui-input", "ui-select", error && "ui-input--error", className)}
        id={selectId}
        {...props}
      >
        {placeholder ? (
          <option value="">
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="ui-field__message ui-field__message--error">{error}</span> : null}
      {!error && hint ? <span className="ui-field__message">{hint}</span> : null}
    </label>
  );
}
