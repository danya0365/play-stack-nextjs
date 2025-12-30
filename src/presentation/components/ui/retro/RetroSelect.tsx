"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface RetroSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
}

export const RetroSelect = forwardRef<HTMLSelectElement, RetroSelectProps>(
  ({ label, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="retro-input-label">{label}</label>}
        <select ref={ref} className={`retro-select ${className}`} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

RetroSelect.displayName = "RetroSelect";
