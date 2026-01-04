"use client";

import { useLayoutStore } from "@/src/presentation/stores/layoutStore";
import { MainLearnLandingView } from "./MainLearnLandingView";
import { RetroLearnLandingView } from "./RetroLearnLandingView";

export function LearnLandingView() {
  const { layout } = useLayoutStore();

  if (layout === "retro") {
    return <RetroLearnLandingView />;
  }

  return <MainLearnLandingView />;
}
