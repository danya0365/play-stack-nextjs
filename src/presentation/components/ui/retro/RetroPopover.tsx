"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface RetroPopoverProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function RetroPopover({ trigger, children }: RetroPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="retro-popover top-full mt-1 left-0">{children}</div>
      )}
    </div>
  );
}

interface PopoverItemProps {
  onClick?: () => void;
  children: ReactNode;
}

export function RetroPopoverItem({ onClick, children }: PopoverItemProps) {
  return (
    <button onClick={onClick} className="retro-popover-item">
      {children}
    </button>
  );
}

export function RetroPopoverSeparator() {
  return <div className="retro-popover-separator" />;
}
