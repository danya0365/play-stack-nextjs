"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface MainButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  loading?: boolean;
}

export const MainButton = forwardRef<HTMLButtonElement, MainButtonProps>(
  (
    {
      variant = "primary",
      icon,
      loading,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClass = {
      primary: "main-btn-primary",
      secondary: "main-btn-secondary",
      ghost: "main-btn-ghost",
    }[variant];

    return (
      <button
        ref={ref}
        className={`main-btn ${variantClass} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="animate-spin">⏳</span>
        ) : (
          icon && <span>{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

MainButton.displayName = "MainButton";
