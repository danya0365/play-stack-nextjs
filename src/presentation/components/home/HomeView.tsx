"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { MainHomeView } from "./MainHomeView";
import { RetroHomeView } from "./RetroHomeView";

export function HomeView() {
  const { layout } = useLayoutStore();

  if (layout === "retro") {
    return <RetroHomeView />;
  }

  return <MainHomeView />;
}
