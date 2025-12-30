"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface MainSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const MainSelect = forwardRef<HTMLSelectElement, MainSelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="main-input-label">{label}</label>}
        <select
          ref={ref}
          className={`main-select ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

MainSelect.displayName = "MainSelect";
