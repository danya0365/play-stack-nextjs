"use client";

import { LoginModal } from "@/src/presentation/components/auth/LoginModal";
import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { usePresentationStore } from "@/src/presentation/stores/presentationStore";
import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";
import { MainLayout } from "./MainLayout";
import { RetroLayout } from "./RetroLayout";

// Lazy load PresentationLayout to avoid React Spring initialization issues
const PresentationLayout = dynamic(
  () => import("@/src/presentation/components/lesson/PresentationLayout").then(m => ({ default: m.PresentationLayout })),
  { ssr: false }
);

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { layout } = useLayoutStore();
  const { isPresenting } = usePresentationStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading or default layout during hydration
  if (!mounted) {
    return (
      <div className="main-layout">
        <div className="main-content flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🎮</div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              Loading Play Stack...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoginModal />
      {/* Presentation overlay - only render when presenting */}
      {isPresenting && <PresentationLayout />}
      
      {/* Main content - hide when presenting */}
      <div style={{ display: isPresenting ? 'none' : 'block' }}>
        {layout === "retro" ? (
          <RetroLayout>{children}</RetroLayout>
        ) : (
          <MainLayout>{children}</MainLayout>
        )}
      </div>
    </>
  );
}
