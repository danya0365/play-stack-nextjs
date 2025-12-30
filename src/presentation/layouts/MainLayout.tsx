"use client";

import { MainFooter } from "@/src/presentation/components/layouts/main/MainFooter";
import { MainHeader } from "@/src/presentation/components/layouts/main/MainHeader";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <MainHeader />
      <main className="main-content">{children}</main>
      <MainFooter />
    </div>
  );
}
