"use client";

import { MainFooter } from "@/src/presentation/components/layouts/main/MainFooter";
import { MainHeader } from "@/src/presentation/components/layouts/main/MainHeader";
import { PresentationLayout } from "@/src/presentation/components/lesson/PresentationLayout";
import { usePresentationStore } from "@/src/presentation/stores/presentationStore";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isPresenting } = usePresentationStore();

  // When presenting, render ONLY the PresentationLayout
  // No Header, No Footer, No background content
  if (isPresenting) {
    return <PresentationLayout />;
  }

  // Normal layout with Header and Footer
  return (
    <div className="main-layout">
      <MainHeader />
      <main className="main-content">{children}</main>
      <MainFooter />
    </div>
  );
}
