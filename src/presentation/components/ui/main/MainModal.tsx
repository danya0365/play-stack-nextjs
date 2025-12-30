"use client";

import { animated, config, useSpring } from "@react-spring/web";
import { ReactNode, useEffect, useRef } from "react";

interface MainModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function MainModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: MainModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Animation
  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: config.gentle,
  });

  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(-20px)",
    config: config.gentle,
  });

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

  // Close on outside click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <animated.div
      style={overlaySpring}
      className="main-modal-overlay"
      onClick={handleOverlayClick}
    >
      <animated.div style={modalSpring} className="main-modal" ref={modalRef}>
        <div className="main-modal-header">
          <h2 className="main-modal-title">{title}</h2>
          <button onClick={onClose} className="main-modal-close">
            ✕
          </button>
        </div>
        <div className="main-modal-body">{children}</div>
        {footer && <div className="main-modal-footer">{footer}</div>}
      </animated.div>
    </animated.div>
  );
}
