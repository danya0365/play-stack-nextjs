"use client";

import { animated, useSpring } from "@react-spring/web";
import { ReactNode, useEffect, useRef, useState } from "react";

interface MainPopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export function MainPopover({
  trigger,
  children,
  align = "left",
}: MainPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const spring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(-10px)",
    config: { tension: 300, friction: 30 },
  });

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
        <animated.div
          style={spring}
          className={`main-popover top-full mt-2 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {children}
        </animated.div>
      )}
    </div>
  );
}

interface PopoverItemProps {
  onClick?: () => void;
  children: ReactNode;
}

export function MainPopoverItem({ onClick, children }: PopoverItemProps) {
  return (
    <button onClick={onClick} className="main-popover-item">
      {children}
    </button>
  );
}
