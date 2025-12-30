"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  icon?: ReactNode;
}

export const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ primary, icon, children, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`retro-btn ${primary ? "retro-btn-primary" : ""} ${className}`}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </button>
    );
  }
);

RetroButton.displayName = "RetroButton";
