"use client";

import { RetroFooter } from "@/src/presentation/components/layouts/retro/RetroFooter";
import { RetroHeader } from "@/src/presentation/components/layouts/retro/RetroHeader";
import { ReactNode } from "react";

interface RetroLayoutProps {
  children: ReactNode;
}

export function RetroLayout({ children }: RetroLayoutProps) {
  return (
    <div className="retro-layout">
      <RetroHeader />
      <main className="retro-content">{children}</main>
      <RetroFooter />
    </div>
  );
}
