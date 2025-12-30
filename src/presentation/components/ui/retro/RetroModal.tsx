"use client";

import { ReactNode, useEffect } from "react";

interface RetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function RetroModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: RetroModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="retro-modal-overlay">
      <div className="retro-modal">
        <div className="retro-modal-titlebar">
          <span className="retro-modal-title">{title}</span>
          <button onClick={onClose} className="retro-modal-close">
            ✕
          </button>
        </div>
        <div className="retro-modal-body">{children}</div>
        {footer && <div className="retro-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
