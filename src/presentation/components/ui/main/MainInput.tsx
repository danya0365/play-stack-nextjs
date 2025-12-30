"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface MainInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const MainInput = forwardRef<HTMLInputElement, MainInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="main-input-label">{label}</label>}
        <input
          ref={ref}
          className={`main-input ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

MainInput.displayName = "MainInput";
