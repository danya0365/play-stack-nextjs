"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface RetroInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const RetroInput = forwardRef<HTMLInputElement, RetroInputProps>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="retro-input-label">{label}</label>}
        <input ref={ref} className={`retro-input ${className}`} {...props} />
      </div>
    );
  }
);

RetroInput.displayName = "RetroInput";
