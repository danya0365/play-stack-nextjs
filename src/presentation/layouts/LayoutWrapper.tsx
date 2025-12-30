"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { ReactNode, useEffect, useState } from "react";
import { MainLayout } from "./MainLayout";
import { RetroLayout } from "./RetroLayout";

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { layout } = useLayoutStore();
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

  if (layout === "retro") {
    return <RetroLayout>{children}</RetroLayout>;
  }

  return <MainLayout>{children}</MainLayout>;
}
